"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function LecturerDashboard() {
  const router = useRouter();

  // Redirect to the main lecturer page
  useEffect(() => {
    router.push("/lecturer");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900" suppressHydrationWarning>
      <LoadingSpinner />
    </div>
  );
} 