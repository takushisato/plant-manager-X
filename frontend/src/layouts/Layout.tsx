import React from "react";
import Header from "@/layouts/block/Header";
import Footer from "@/layouts/block/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <div>
        <Header />
        <div>
          <main>{children}</main>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Layout;
