"use client";

import React, { useEffect, useState } from "react";
import ClaimWepeContent from "@/components/custom/client/section/ClaimWepeContent";

const ClaimWepe = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen w-full flex transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white overflow-hidden">
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-8 md:p-10 lg:p-12">
          <ClaimWepeContent />
        </div>
      </main>
    </div>
  );
};

export default ClaimWepe;
