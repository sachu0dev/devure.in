"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Mail,
  Calendar,
  Pause,
  Play,
  Trash2,
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckSquare,
  Square,
} from "lucide-react";
import { toast } from "sonner";

interface Subscription {
  _id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  lastEmailSent?: string;
  preferences?: {
    blogUpdates: boolean;
    newsletter: boolean;
    productUpdates: boolean;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>(
    []
  );
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Fetch subscriptions
  const fetchSubscriptions = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
          search,
          status: statusFilter,
        });

        const response = await fetch(`/api/admin/subscriptions?${params}`);
        const data = await response.json();

        if (data.success) {
          setSubscriptions(data.data);
          setPagination(data.pagination);
          setCurrentPage(page);
        } else {
          toast.error(data.error || "Failed to fetch subscriptions");
        }
      } catch {
        toast.error("Failed to fetch subscriptions");
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter]
  );

  // Handle subscription action
  const handleSubscriptionAction = async (
    subscriptionId: string,
    action: string
  ) => {
    try {
      setActionLoading(subscriptionId);

      const response = await fetch("/api/admin/subscriptions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId, action }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        // Refresh the current page
        fetchSubscriptions(currentPage);
      } else {
        toast.error(data.error || "Failed to update subscription");
      }
    } catch {
      toast.error("Failed to update subscription");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle hard delete
  const handleDelete = async (subscriptionId: string) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this subscription? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setActionLoading(subscriptionId);

      const response = await fetch(
        `/api/admin/subscriptions?id=${subscriptionId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Subscription deleted permanently");
        // Refresh the current page
        fetchSubscriptions(currentPage);
      } else {
        toast.error(data.error || "Failed to delete subscription");
      }
    } catch {
      toast.error("Failed to delete subscription");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedSubscriptions.length === 0) {
      toast.error("Please select subscriptions first");
      return;
    }

    try {
      setBulkActionLoading(true);

      const response = await fetch("/api/admin/subscriptions/bulk-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionIds: selectedSubscriptions,
          action,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setSelectedSubscriptions([]);
        fetchSubscriptions(currentPage);
      } else {
        toast.error(data.error || "Failed to perform bulk action");
      }
    } catch {
      toast.error("Failed to perform bulk action");
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedSubscriptions.length === 0) {
      toast.error("Please select subscriptions first");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to permanently delete ${selectedSubscriptions.length} subscription(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setBulkActionLoading(true);

      const response = await fetch("/api/admin/subscriptions/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionIds: selectedSubscriptions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setSelectedSubscriptions([]);
        fetchSubscriptions(currentPage);
      } else {
        toast.error(data.error || "Failed to delete subscriptions");
      }
    } catch {
      toast.error("Failed to delete subscriptions");
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Handle selection
  const handleSelectAll = () => {
    if (selectedSubscriptions.length === subscriptions.length) {
      setSelectedSubscriptions([]);
    } else {
      setSelectedSubscriptions(subscriptions.map((s) => s._id));
    }
  };

  const handleSelectSubscription = (subscriptionId: string) => {
    setSelectedSubscriptions((prev) =>
      prev.includes(subscriptionId)
        ? prev.filter((id) => id !== subscriptionId)
        : [...prev, subscriptionId]
    );
  };

  // Search and filter
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSubscriptions(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, statusFilter, fetchSubscriptions]);

  // Initial fetch
  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        Active
      </Badge>
    ) : (
      <Badge variant="secondary">
        <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
        Paused
      </Badge>
    );
  };

  if (loading && subscriptions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Subscription Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage email subscriptions and preferences
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {pagination?.total || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Subscribers
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {subscriptions.filter((s) => s.isActive).length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subscriptions</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="paused">Paused Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedSubscriptions.length > 0 && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-900">
                  {selectedSubscriptions.length} subscription(s) selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("activate")}
                  disabled={bulkActionLoading}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Activate All
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("pause")}
                  disabled={bulkActionLoading}
                  className="text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause All
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={bulkActionLoading}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscriptions List */}
      <div className="space-y-4">
        {/* Select All Header */}
        {subscriptions.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {selectedSubscriptions.length === subscriptions.length ? (
                <CheckSquare className="w-4 h-4 text-primary" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>
                {selectedSubscriptions.length === subscriptions.length
                  ? "Deselect All"
                  : "Select All"}
              </span>
            </button>
          </div>
        )}

        {subscriptions.map((subscription) => (
          <Card key={subscription._id}>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Selection Checkbox */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSelectSubscription(subscription._id)}
                    className="flex items-center gap-2"
                  >
                    {selectedSubscriptions.includes(subscription._id) ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4 text-primary" />
                    )}
                  </button>
                </div>

                {/* Subscription Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {subscription.email}
                    </span>
                    {getStatusBadge(subscription.isActive)}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Subscribed: {formatDate(subscription.subscribedAt)}
                      </span>
                    </div>

                    {subscription.lastEmailSent && (
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>
                          Last email: {formatDate(subscription.lastEmailSent)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Preferences */}
                  {subscription.preferences && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {subscription.preferences.blogUpdates && (
                        <Badge variant="outline" className="text-xs">
                          Blog Updates
                        </Badge>
                      )}
                      {subscription.preferences.newsletter && (
                        <Badge variant="outline" className="text-xs">
                          Newsletter
                        </Badge>
                      )}
                      {subscription.preferences.productUpdates && (
                        <Badge variant="outline" className="text-xs">
                          Product Updates
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {subscription.isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSubscriptionAction(subscription._id, "pause")
                      }
                      disabled={actionLoading === subscription._id}
                      className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSubscriptionAction(subscription._id, "activate")
                      }
                      disabled={actionLoading === subscription._id}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Activate
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(subscription._id)}
                    disabled={actionLoading === subscription._id}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchSubscriptions(pagination.page - 1)}
              disabled={!pagination.hasPrev}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <span className="text-sm text-muted-foreground px-3">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchSubscriptions(pagination.page + 1)}
              disabled={!pagination.hasNext}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {subscriptions.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No subscriptions found
            </h3>
            <p className="text-muted-foreground">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No one has subscribed to updates yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
