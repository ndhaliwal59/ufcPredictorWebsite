import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0A0F16] to-[#1E2530] relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute right-0 top-0 w-full h-full bg-[#33C6FF]/20"></div>
        <div className="absolute left-0 bottom-0 w-full h-full bg-[#FF4D4D]/20"></div>
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10 section-fade">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Elevate Your UFC Fight Analysis?
        </h2>
        <p className="text-xl text-[#E0E0E0] mb-10 max-w-3xl mx-auto">
          Join thousands of fans and bettors using AI-driven insights to understand fights better.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="gradient-button text-white px-8 py-4 rounded-lg font-bold text-lg h-auto">
            <a href="/events">View Upcoming Events</a>
          </Button>
          <Button 
            className="bg-white text-[#0A0F16] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300 h-auto"
            asChild
          >
            <a href="/how-it-works">Learn How It Works</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
