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

      <section className="relative w-full flex-1 border-t border-white/10 bg-flownex-black px-6 py-28 text-flownex-white md:px-16 md:py-36">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16 relative">
          <aside className="self-start lg:sticky lg:top-[20vh] lg:col-span-5 lg:py-2 z-10">
            <div className="space-y-8">
              <div className="border-l-4 border-flownex-pink py-1 pl-6 sm:pl-8">
                <h1 className="font-logo select-none text-5xl font-extrabold uppercase leading-[1] tracking-[0.08em] text-flownex-white sm:text-7xl lg:text-8xl">
                  SCHEDULE<br />
                  YOUR<br />
                  MEETING
                </h1>
              </div>

              <p className="max-w-md pt-2 font-body text-base font-normal leading-relaxed text-flownex-white/80">
                Let&apos;s discuss how we can build, work, and flow better.
              </p>
            </div>
          </aside>

          <div className="min-w-0 lg:col-span-7 pt-[10vh] lg:pt-[25vh] pb-[10vh] lg:pb-[25vh]">
            <ScheduleForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
