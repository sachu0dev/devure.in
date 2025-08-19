import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAuth } from "@/lib/api";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage for immediate feedback
        const localAuth = localStorage.getItem("adminAuthenticated") === "true";
        setIsAuthenticated(localAuth);

        if (localAuth) {
          // Then verify with server
          const response = await checkAdminAuth();
          if (!response.success) {
            // Server says not authenticated, clear local state
            localStorage.removeItem("adminAuthenticated");
            localStorage.removeItem("adminUsername");
            localStorage.removeItem("adminToken");
            setIsAuthenticated(false);
            router.push("/admin/login");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("adminAuthenticated");
        localStorage.removeItem("adminUsername");
        localStorage.removeItem("adminToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminUsername");
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    router.push("/admin/login");
  };

  return {
    isAuthenticated,
    loading,
    logout,
  };
}
