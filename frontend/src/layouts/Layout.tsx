import React from "react";
import Header from "@/layouts/block/Header";
import Footer from "@/layouts/block/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />

      <main style={{ flex: 1 }}>{children}</main>

      <Footer />
    </div>
  );
}

export default Layout;