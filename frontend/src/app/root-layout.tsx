import { ReactNode } from "react";
import { metadata } from "./metadata";
import RootLayout from "./layout";

interface RootLayoutWrapperProps {
  children: ReactNode;
}

export { metadata };

export default function RootLayoutWrapper({ children }: RootLayoutWrapperProps) {
  return <RootLayout>{children}</RootLayout>;
} 