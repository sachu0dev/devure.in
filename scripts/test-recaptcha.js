// Test script to verify reCAPTCHA configuration
// Run with: node scripts/test-recaptcha.js

async function testRecaptcha() {
  console.log("🔍 Testing reCAPTCHA Configuration...\n");

  // Check environment variables
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const secretKey =
    process.env.RECAPTCHA_SECRET_KEY || process.env.GOOGLE_RECAPTCHA_SECRET_KEY;

  console.log("Environment Variables:");
  console.log(
    `  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: ${siteKey ? "✅ Set" : "❌ Missing"}`
  );
  console.log(`  RECAPTCHA_SECRET_KEY: ${secretKey ? "✅ Set" : "❌ Missing"}`);

  if (!siteKey || !secretKey) {
    console.log("\n❌ Configuration incomplete!");
    console.log("Please set the required environment variables.");
    return;
  }

  // Test the validation function
  console.log("\n🧪 Testing reCAPTCHA validation...");

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", "test_token");

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = await response.json();

    if (data.success === false && data["error-codes"]) {
      console.log("✅ reCAPTCHA API is accessible");
      console.log("❌ Test token failed (expected):", data["error-codes"][0]);
      console.log("\n🎉 Configuration looks good!");
    } else {
      console.log("❌ Unexpected response:", data);
    }
  } catch (error) {
    console.log("❌ Error testing reCAPTCHA:", error.message);
  }
}

// Run the test
testRecaptcha().catch(console.error);
