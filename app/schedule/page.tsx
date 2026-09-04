import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScheduleForm from "@/components/ScheduleForm";

export default function SchedulePage() {
  return (
    <main className="relative w-full bg-flownex-black text-flownex-white overflow-x-clip min-h-screen flex flex-col">
      <Header />
      
      {/* Spacer for fixed header */}
      <div className="h-24 md:h-32"></div>

      <div className="flex-1">
        <ScheduleForm />
      </div>

      <Footer />
    </main>
  );
}

