"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getAdminServices,
  deleteService,
  handleApiError,
  getAdminServicesHeader,
  updateServicesHeader,
} from "@/lib/api";
import { Service, ServicesHeader } from "@/lib/api";
import Link from "next/link";

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [header, setHeader] = useState<ServicesHeader | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const [editingHeader, setEditingHeader] = useState(false);
  const [headerForm, setHeaderForm] = useState({
    mainTitle: "",
    services: [] as string[],
  });

  const router = useRouter();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [servicesResponse, headerResponse] = await Promise.all([
        getAdminServices({ page: 1, limit: 20, status }),
        getAdminServicesHeader(),
      ]);

      setServices(servicesResponse.services);

      setHeader(headerResponse);
      setHeaderForm({
        mainTitle: headerResponse.mainTitle,
        services: headerResponse.services,
      });
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
    if (isAuthenticated !== "true") {
      router.push("/admin/login");
      return;
    }

    loadData();
  }, [router, loadData]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAdminServices({
        page: 1,
        limit: 20,
        search: searchTerm,
        status,
      });

      setServices(response.services);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error("Error searching services:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await deleteService(slug);
      setServices((prev) => prev.filter((service) => service.slug !== slug));
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error("Error deleting service:", errorMessage);
    }
  };

  const handleHeaderSave = async () => {
    try {
      setError(null);
      const updatedHeader = await updateServicesHeader(headerForm);
      setHeader(updatedHeader);
      setEditingHeader(false);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error("Error updating header:", errorMessage);
    }
  };

  const addServiceItem = () => {
    setHeaderForm((prev) => ({
      ...prev,
      services: [...prev.services, ""],
    }));
  };

  const removeServiceItem = (index: number) => {
    setHeaderForm((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const updateServiceItem = (index: number, value: string) => {
    setHeaderForm((prev) => ({
      ...prev,
      services: prev.services.map((item, i) => (i === index ? value : item)),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">
            Manage your services and header content
          </p>
        </div>
        <Link href="/adminead/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Service
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Services Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Services Header</CardTitle>
            {!editingHeader ? (
              <Button onClick={() => setEditingHeader(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Header
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleHeaderSave}>Save Changes</Button>
                <Button
                  onClick={() => setEditingHeader(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editingHeader ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Title
                </label>
                <Input
                  value={headerForm.mainTitle}
                  onChange={(e) =>
                    setHeaderForm((prev) => ({
                      ...prev,
                      mainTitle: e.target.value,
                    }))
                  }
                  placeholder="e.g., Creating impact in"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotating Services
                </label>
                <div className="space-y-2">
                  {headerForm.services.map((service, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={service}
                        onChange={(e) =>
                          updateServiceItem(index, e.target.value)
                        }
                        placeholder="Service name"
                      />
                      <Button
                        onClick={() => removeServiceItem(index)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addServiceItem} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Main Title:
                </span>
                <p className="text-lg font-semibold">{header?.mainTitle}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Rotating Services:
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {header?.services.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "all" | "active" | "inactive")
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => (
          <Card key={service._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    <Badge variant="outline">{service.serviceType}</Badge>
                    {service.isFeatured && (
                      <Badge
                        variant="default"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge variant={service.isActive ? "default" : "secondary"}>
                      {service.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {service.excerpt && (
                    <p className="text-gray-600 mb-3">{service.excerpt}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Order: {service.order}</span>
                    <span>•</span>
                    <span>
                      Created:{" "}
                      {new Date(service.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/services/${service.slug}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(service.slug)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-lg">Loading services...</div>
        </div>
      )}

      {/* No services message */}
      {!loading && services.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No services found</div>
          <Link href="/admin/services/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Service
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
