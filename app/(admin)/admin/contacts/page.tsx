"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactSummary {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  website?: string;
  projectType: string;
  serviceType: string;
  budget: string;
  timeline: string;
  message: string;
  requestedCall: boolean;
  createdAt: string;
  ipAddress?: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactSummary[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactSummary[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactSummary | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/admin/login");
      return;
    }

    loadContacts();
  }, [router]);

  const filterContacts = useCallback(() => {
    let filtered = contacts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (contact) =>
          contact.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.projectType
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          contact.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((contact) => {
        if (statusFilter === "callback") return contact.requestedCall;
        if (statusFilter === "message") return !contact.requestedCall;
        return true;
      });
    }

    setFilteredContacts(filtered);
  }, [contacts, searchQuery, statusFilter]);

  useEffect(() => {
    filterContacts();
  }, [filterContacts]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/contacts");
      if (!response.ok) {
        throw new Error("Failed to load contacts");
      }

      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load contacts";
      setError(errorMessage);
      console.error("Error loading contacts:", errorMessage);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProjectTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      new_project: "New Project",
      redesign: "Redesign",
      maintenance: "Maintenance",
      consultation: "Consultation",
    };
    return labels[type] || type;
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      web_app: "Web App",
      landing_page: "Landing Page",
      ecommerce: "E-commerce",
      mobile_app: "Mobile App",
      ui_ux: "UI/UX Design",
      api_integration: "API Integration",
      seo: "SEO",
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading contacts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">
            Error loading contacts
          </div>
          <div className="text-sm text-gray-600 mb-4">{error}</div>
          <Button onClick={loadContacts}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Contact Submissions
          </h1>
          <p className="text-gray-600">
            Manage and view contact form submissions
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {contacts.length} submissions
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Submissions</option>
              <option value="callback">Callback Requests</option>
              <option value="message">Messages Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <Card key={contact._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{contact.fullName}</CardTitle>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                </div>
                <div className="flex gap-2">
                  {contact.requestedCall && (
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-800"
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Callback
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {getProjectTypeLabel(contact.projectType)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">
                  Service: {getServiceTypeLabel(contact.serviceType)}
                </p>
                <p className="text-gray-600">Budget: {contact.budget}</p>
                <p className="text-gray-600">Timeline: {contact.timeline}</p>
              </div>

              <div className="text-sm text-gray-600">
                <p className="line-clamp-3">{contact.message}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(contact.createdAt)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedContact(contact)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No contacts found.</p>
        </div>
      )}

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Contact Details</h2>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedContact(null)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <p className="text-sm">{selectedContact.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-sm">{selectedContact.email}</p>
                  </div>
                </div>

                {selectedContact.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Phone
                    </label>
                    <p className="text-sm">{selectedContact.phone}</p>
                  </div>
                )}

                {selectedContact.website && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Website
                    </label>
                    <p className="text-sm">
                      <a
                        href={selectedContact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedContact.website}
                      </a>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Project Type
                    </label>
                    <p className="text-sm">
                      {getProjectTypeLabel(selectedContact.projectType)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Service Type
                    </label>
                    <p className="text-sm">
                      {getServiceTypeLabel(selectedContact.serviceType)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Budget
                    </label>
                    <p className="text-sm">{selectedContact.budget}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Timeline
                    </label>
                    <p className="text-sm">{selectedContact.timeline}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Message
                  </label>
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Submission Type
                    </label>
                    <p className="text-sm">
                      {selectedContact.requestedCall
                        ? "Callback Request"
                        : "Message Only"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Submitted
                    </label>
                    <p className="text-sm">
                      {formatDate(selectedContact.createdAt)}
                    </p>
                  </div>
                </div>

                {selectedContact.ipAddress && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      IP Address
                    </label>
                    <p className="text-sm text-gray-500">
                      {selectedContact.ipAddress}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
