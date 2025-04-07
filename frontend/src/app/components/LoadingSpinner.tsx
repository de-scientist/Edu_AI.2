"use client";

import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center" suppressHydrationWarning>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );
} 