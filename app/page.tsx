"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import BootScreen from "@/components/BootScreen";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandCenter from "@/components/CommandCenter";
import SystemHUD from "@/components/SystemHUD";
import JournalReader from "@/components/JournalReader";

export default function Home() {
  const [booted, setBooted] = useState<boolean | null>(null);

  useEffect(() => {
    const already = sessionStorage.getItem("shivam-booted");
    setBooted(already === "1");
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem("shivam-booted", "1");
    setBooted(true);
  };

  // Don't render anything until we've checked sessionStorage to avoid flicker.
  if (booted === null) {
    return <div className="fixed inset-0 bg-ink" />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!booted && <BootScreen key="boot" onComplete={handleBootComplete} />}
      </AnimatePresence>

      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <main className="relative">
        <Hero booted={booted} />
        <About booted={booted} />
        <Projects />
        <Skills />
        <Blog />
        <Contact />
      </main>

      <Footer />
      
      {/* OS Layer Components */}
      <CommandCenter />
      <SystemHUD />
      <JournalReader />
    </>
  );
}
