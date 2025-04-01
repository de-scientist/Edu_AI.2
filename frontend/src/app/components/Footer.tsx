import { useState, useEffect } from "react";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear()); // ✅ Ensures consistent rendering
  }, []);

  return (
    <>
      <footer className="fixed bottom-0 left-0 w-full bg-blue-600 text-white py-4 text-center shadow-md">
        © {year ?? "..."} Edu_AI. All rights reserved.
      </footer>
      <div className="pb-16"></div>
    </>
  );
}
