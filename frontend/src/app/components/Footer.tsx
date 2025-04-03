"use client"; // ✅ client-side component

import { useState, useEffect } from "react";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear()); // ✅ Set the current year on mount
  }, []);

  return (
    <footer className="text-center py-4 bg-gray-100 dark:bg-gray-800">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        © {year} Edu_AI. All rights reserved.
      </p>
    </footer>
  );
}
