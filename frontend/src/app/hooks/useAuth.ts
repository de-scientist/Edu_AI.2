"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth(requiredRole?: string) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      if (status === "loading") {
        setIsLoading(true);
      } else if (status === "authenticated" && session?.user) {
        setIsLoading(false);
        setIsAuthenticated(true);
        setUserRole(session.user.role?.toLowerCase() || null);
        
        // Check if user has the required role
        if (requiredRole && session.user.role?.toLowerCase() !== requiredRole.toLowerCase()) {
          router.push("/unauthorized");
        }
      } else {
        setIsLoading(false);
        setIsAuthenticated(false);
        setUserRole(null);
        
        // Redirect to login if not authenticated
        if (requiredRole) {
          router.push("/auth/signin");
        }
      }
    }
  }, [status, session, requiredRole, router]);

  // Helper function to get the correct dashboard path based on role
  const getDashboardPath = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "/admin/dashboard";
      case "lecturer":
        return "/lecturer"; // Changed from /lecturer/dashboard to /lecturer
      case "student":
        return "/student/dashboard";
      default:
        return "/";
    }
  };

  return {
    isLoading,
    isAuthenticated,
    userRole,
    session,
    status,
    getDashboardPath
  };
} 