"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Star, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminProjects, deleteProject, handleApiError } from "@/lib/api";
import { Project } from "@/lib/api";
import Link from "next/link";

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const router = useRouter();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAdminProjects({ page: 1, limit: 20, status });
      setProjects(response.projects);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error("Error loading data:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    loadData();
  }, [loadData, router]);

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(projectId);
      await loadData(); // Reload data
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error("Error deleting project:", errorMessage);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Projects Management
            </h1>
            <p className="text-gray-600 mt-2">Manage your portfolio projects</p>
          </div>
          <Link href="/admin/projects/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={status === "all" ? "default" : "outline"}
                onClick={() => setStatus("all")}
              >
                All
              </Button>
              <Button
                variant={status === "active" ? "default" : "outline"}
                onClick={() => setStatus("active")}
              >
                Active
              </Button>
              <Button
                variant={status === "inactive" ? "default" : "outline"}
                onClick={() => setStatus("inactive")}
              >
                Inactive
              </Button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Projects List */}
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <Card
              key={project._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <Badge variant="outline">{project.category}</Badge>
                      {project.isFeatured && (
                        <Badge
                          variant="default"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge
                        variant={project.isActive ? "default" : "secondary"}
                      >
                        {project.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {project.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      {project.client && (
                        <>
                          <span>Client: {project.client}</span>
                          <span>•</span>
                        </>
                      )}
                      {project.duration && (
                        <>
                          <span>Duration: {project.duration}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>Order: {project.order}</span>
                      <span>•</span>
                      <span>
                        Created:{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.technologies.slice(0, 5).map((tech: string) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 5} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
                        >
                          <Github className="w-3 h-3" />
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/projects/${project.slug}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              {searchTerm || status !== "all"
                ? "No projects found matching your criteria"
                : "No projects found"}
            </p>
            {searchTerm || status !== "all" ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatus("all");
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Link href="/admin/projects/create">
                <Button>Create Your First Project</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
