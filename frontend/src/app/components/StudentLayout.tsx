import { ReactNode } from "react";

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return <div className="bg-blue-50 min-h-screen">{children}</div>;
}
