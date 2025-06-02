import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import myImage from '../assets/r504811_1296x864_3-2.jpg';

export default function HeroSection() {
  return (
    <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="hero">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-b from-[#33C6FF]/20 to-transparent"></div>
        <div className="absolute left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-[#FF4D4D]/20 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="section-fade visible">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
              Smarter Fight <span className="text-[#FF4D4D]">Predictions.</span><br />
              <span className="text-[#33C6FF]">AI</span> vs The Bookies.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[#E0E0E0] max-w-xl">
              We predict UFC fight outcomes using AI to gain an edge over major sportsbooks.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild className="gradient-button text-white px-8 py-7 rounded-lg font-bold text-lg h-auto">
                <a href="/events">
                  View Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="outline" className="bg-[#1E2530] text-white border-none px-8 py-7 rounded-lg font-bold text-lg hover:bg-gray-700 transition duration-300 h-auto">
                <a href="/how-it-works">
                  How It Works
                </a>
              </Button> 
            </div>
          </div>
          <div className="section-fade visible relative">
            {/* A high-energy shot of UFC fighters during an intense match */}
            <img 
              src={myImage}
              alt="UFC fighters in action" 
              className="rounded-2xl shadow-2xl w-full h-auto" 
            />
            <div className="absolute -bottom-5 -left-5 bg-[#1E2530] p-4 rounded-xl shadow-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#33C6FF]/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#33C6FF]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 7H7v6h6V7z" />
                    <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-[#9CA3AF]">AI accuracy rate</p>
                  <p className="text-xl font-bold text-white">67.41%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
