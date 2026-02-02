import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

interface LayoutProps {
  children: ReactNode;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

const Layout = ({ children, meta }: LayoutProps) => {
  useDocumentMeta(meta);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
