import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useScrollToHash } from "../hooks/useScrollToHash";
import WaitlistSection from "../components/WaitlistSection";

export default function MainLayout({ children }) {
   useScrollToHash();
  return (
    <div className="min-h-screen bg-niamind-bg text-niamind-text">
      <Navbar />
      <main className="pt-20">
        {children}
        {/* <WaitlistSection /> */}
      </main>
      <Footer />
    </div>
  );
}
