import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env";

// Initialize S3 client
const s3Client = new S3Client({
  region: env.AWS_S3_REGION,
  credentials: {
    accessKeyId: env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY!,
  },
  ...(env.AWS_S3_ENDPOINT && { endpoint: env.AWS_S3_ENDPOINT }),
});

export class S3Service {
  private bucket: string;
  private region: string;

  constructor() {
    this.bucket = env.AWS_S3_BUCKET_NAME!;
    this.region = env.AWS_S3_REGION!;
  }

  /**
   * Sanitize metadata for S3 headers
   * S3 metadata keys and values must be valid HTTP header values
   */
  private sanitizeMetadata(
    metadata?: Record<string, string>
  ): Record<string, string> | undefined {
    if (!metadata) return undefined;

    const sanitized: Record<string, string> = {};

    for (const [key, value] of Object.entries(metadata)) {
      // Sanitize key: lowercase, replace invalid chars with hyphens
      const sanitizedKey = key
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      // Sanitize value: remove or replace invalid characters
      const sanitizedValue = value
        .replace(/[\x00-\x1f\x7f]/g, "") // Remove control characters
        .replace(/[^\x20-\x7e]/g, "") // Remove non-printable ASCII
        .trim()
        .substring(0, 1024); // Limit length

      if (sanitizedKey && sanitizedValue) {
        sanitized[sanitizedKey] = sanitizedValue;
      }
    }

    // Log sanitization for debugging
    if (Object.keys(metadata).length !== Object.keys(sanitized).length) {
      console.warn("S3 metadata sanitization removed some invalid entries:", {
        original: Object.keys(metadata),
        sanitized: Object.keys(sanitized),
      });
    }

    return Object.keys(sanitized).length > 0 ? sanitized : undefined;
  }

  /**
   * Upload a file to S3
   */
  async uploadFile(
    key: string,
    content: string | Buffer,
    contentType: string = "text/plain",
    metadata?: Record<string, string>
  ): Promise<{ url: string; key: string; etag: string }> {
    try {
      const sanitizedMetadata = this.sanitizeMetadata(metadata);

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: content,
        ContentType: contentType,
        Metadata: sanitizedMetadata,
      });

      const result = await s3Client.send(command);

      return {
        url: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`,
        key,
        etag: result.ETag?.replace(/"/g, "") || "",
      };
    } catch (error) {
      console.error("S3 upload error:", error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("Invalid character in header content")) {
          throw new Error(
            `S3 metadata contains invalid characters. Please check your content for special characters or emojis.`
          );
        }
        if (error.message.includes("Access Denied")) {
          throw new Error(
            `S3 access denied. Please check your AWS credentials and bucket permissions.`
          );
        }
        if (error.message.includes("NoSuchBucket")) {
          throw new Error(
            `S3 bucket not found. Please check your bucket configuration.`
          );
        }
      }

      throw new Error(`Failed to upload file to S3: ${error}`);
    }
  }

  /**
   * Upload blog content as MDX file
   */
  async uploadBlogContent(
    slug: string,
    content: string,
    metadata?: Record<string, string>
  ): Promise<{ url: string; key: string; etag: string }> {
    const key = `${env.AWS_S3_MDX_PREFIX}/${slug}.mdx`;

    // Use safe metadata keys for blog content
    const safeMetadata = metadata
      ? {
          "blog-title": metadata.title || "",
          "blog-author": metadata.author || "",
          "blog-category": metadata.category || "",
          "blog-slug": slug,
          "upload-date": new Date().toISOString(),
        }
      : undefined;

    return this.uploadFile(key, content, "text/markdown", safeMetadata);
  }

  /**
   * Upload image file
   */
  async uploadImage(
    filename: string,
    buffer: Buffer,
    contentType: string,
    metadata?: Record<string, string>
  ): Promise<{ url: string; key: string; etag: string }> {
    const key = `${env.AWS_S3_IMAGES_PREFIX}/${filename}`;

    // Use safe metadata keys for images
    const safeMetadata = metadata
      ? {
          "image-filename": filename,
          "image-type": contentType,
          "upload-date": new Date().toISOString(),
          ...Object.fromEntries(
            Object.entries(metadata).map(([k, v]) => [
              `image-${k.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
              v,
            ])
          ),
        }
      : undefined;

    return this.uploadFile(key, buffer, contentType, safeMetadata);
  }

  /**
   * Get a file from S3
   */
  async getFile(
    key: string
  ): Promise<{ content: string; contentType: string; lastModified: Date }> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const result = await s3Client.send(command);
      const content = await result.Body?.transformToString();

      if (!content) {
        throw new Error("File content is empty");
      }

      return {
        content,
        contentType: result.ContentType || "text/plain",
        lastModified: result.LastModified || new Date(),
      };
    } catch (error) {
      console.error("S3 get file error:", error);
      throw new Error(`Failed to get file from S3: ${error}`);
    }
  }

  /**
   * Get blog content from S3
   */
  async getBlogContent(
    slug: string
  ): Promise<{ content: string; lastModified: Date }> {
    const key = `${env.AWS_S3_MDX_PREFIX}/${slug}.mdx`;
    const result = await this.getFile(key);
    return {
      content: result.content,
      lastModified: result.lastModified,
    };
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await s3Client.send(command);
    } catch (error) {
      console.error("S3 delete error:", error);
      throw new Error(`Failed to delete file from S3: ${error}`);
    }
  }

  /**
   * Delete blog content from S3
   */
  async deleteBlogContent(slug: string): Promise<void> {
    const key = `${env.AWS_S3_MDX_PREFIX}/${slug}.mdx`;
    await this.deleteFile(key);
  }

  /**
   * Check if file exists in S3
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await s3Client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate a presigned URL for direct upload
   */
  async generatePresignedUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
      });

      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
      console.error("S3 presigned URL error:", error);
      throw new Error(`Failed to generate presigned URL: ${error}`);
    }
  }

  /**
   * Generate a presigned URL for reading
   */
  async generateReadUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
      console.error("S3 read URL error:", error);
      throw new Error(`Failed to generate read URL: ${error}`);
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(key: string): Promise<{
    contentType: string;
    contentLength: number;
    lastModified: Date;
    etag: string;
  }> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const result = await s3Client.send(command);

      return {
        contentType: result.ContentType || "text/plain",
        contentLength: result.ContentLength || 0,
        lastModified: result.LastModified || new Date(),
        etag: result.ETag?.replace(/"/g, "") || "",
      };
    } catch (error) {
      console.error("S3 metadata error:", error);
      throw new Error(`Failed to get file metadata: ${error}`);
    }
  }
}

// Export singleton instance
export const s3Service = new S3Service();
