import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LivePreviewSection from "@/components/LivePreviewSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import WhyUseThisSection from "@/components/WhyUseThisSection";
import TestimonialSection from "@/components/TestimonialSection";
import AboutSectionPreview from "@/components/AboutSectionPreview";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { FightPrediction, Feature, Step, Testimonial } from "@/lib/types";

export default function Home() {
  // Sample data for featured fights
  const featuredFights: FightPrediction[] = [
    {
      fighterA: { 
        name: "Alex Pereira", 
        image: "https://pixabay.com/get/g6286cadc69d4c47e40097c98ea4a7b5d7029a6baa53c8eb621746d408fcd472b0796ef0e432b30be82b9b0d18990c081d1c0b916f78ff40b479f991279885f73_1280.jpg" 
      },
      fighterB: { 
        name: "Jiri Prochazka", 
        image: "https://pixabay.com/get/g6286cadc69d4c47e40097c98ea4a7b5d7029a6baa53c8eb621746d408fcd472b0796ef0e432b30be82b9b0d18990c081d1c0b916f78ff40b479f991279885f73_1280.jpg" 
      },
      predictionA: 72,
      predictionB: 28,
      ourOddsA: "-220",
      ourOddsB: "+190",
      bookieOddsA: "-280",
      bookieOddsB: "+240",
      hasValue: true,
      valueOn: 'B',
      event: "UFC 300",
      type: "Main Event"
    },
    {
      fighterA: { 
        name: "Sean O'Malley", 
        image: "https://pixabay.com/get/g6286cadc69d4c47e40097c98ea4a7b5d7029a6baa53c8eb621746d408fcd472b0796ef0e432b30be82b9b0d18990c081d1c0b916f78ff40b479f991279885f73_1280.jpg" 
      },
      fighterB: { 
        name: "Merab Dvalishvili", 
        image: "https://pixabay.com/get/g6286cadc69d4c47e40097c98ea4a7b5d7029a6baa53c8eb621746d408fcd472b0796ef0e432b30be82b9b0d18990c081d1c0b916f78ff40b479f991279885f73_1280.jpg" 
      },
      predictionA: 45,
      predictionB: 55,
      ourOddsA: "+110",
      ourOddsB: "-130",
      bookieOddsA: "+125",
      bookieOddsB: "-145",
      hasValue: false,
      valueOn: null,
      event: "UFC 300",
      type: "Co-Main"
    },
    {
      fighterA: { 
        name: "Jon Jones", 
        image: "https://pixabay.com/get/g6286cadc69d4c47e40097c98ea4a7b5d7029a6baa53c8eb621746d408fcd472b0796ef0e432b30be82b9b0d18990c081d1c0b916f78ff40b479f991279885f73_1280.jpg" 
      },
      fighterB: { 
        name: "Stipe Miocic", 
        image: "https://pixabay.com/get/g6286cadc69d4c47e40097c98ea4a7b5d7029a6baa53c8eb621746d408fcd472b0796ef0e432b30be82b9b0d18990c081d1c0b916f78ff40b479f991279885f73_1280.jpg" 
      },
      predictionA: 65,
      predictionB: 35,
      ourOddsA: "-180",
      ourOddsB: "+160",
      bookieOddsA: "-310",
      bookieOddsB: "+250",
      hasValue: true,
      valueOn: 'B',
      event: "UFC Fight Night",
      type: "Main Event"
    }
  ];

  // How it works steps
  const steps: Step[] = [
    {
      number: 1,
      icon: "database",
      title: "Data Analysis",
      description: "We collect and analyze fighter stats, historical performance, and match contexts using our proprietary database.",
      bgColor: "bg-[#33C6FF]/20",
      iconColor: "text-[#33C6FF]",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80"
    },
    {
      number: 2,
      icon: "robot",
      title: "AI Prediction",
      description: "Our machine learning models predict fight outcomes and win probabilities based on thousands of data points.",
      bgColor: "bg-[#FF4D4D]/20",
      iconColor: "text-[#FF4D4D]",
      image: "https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80"
    },
    {
      number: 3,
      icon: "chart-line",
      title: "Odds Comparison",
      description: "We convert our predictions to odds and compare them with major sportsbooks to identify value betting opportunities.",
      bgColor: "bg-[#4DFF91]/20",
      iconColor: "text-[#4DFF91]",
      image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80"
    }
  ];

  // Features for "Why Use This"
  const features: Feature[] = [
    {
      icon: "search-dollar",
      title: "Spot Value Bets",
      description: "Identify overlooked opportunities that sportsbooks might miss with our data-driven analysis."
    },
    {
      icon: "chart-pie",
      title: "Unbiased Predictions",
      description: "Our AI doesn't have favorites – just pure data analysis for objective fight predictions."
    },
    {
      icon: "bolt",
      title: "Fast & Free Access",
      description: "Get premium-quality predictions without any subscription fees or complicated sign-up process."
    },
    {
      icon: "brain",
      title: "Advanced AI Models",
      description: "Benefit from sophisticated machine learning algorithms trained on years of UFC fight data."
    },
    {
      icon: "history",
      title: "Historical Accuracy",
      description: "Our models have demonstrated consistent predictive power across a wide range of fight styles and weight classes."
    },
    {
      icon: "mobile-alt",
      title: "Mobile Optimized",
      description: "Access predictions on any device, perfect for checking odds while watching the fights or at the sportsbook."
    }
  ];

  // Testimonial
  const testimonial: Testimonial = {
    quote: "This tool changed how I bet on UFC. It's sharp, data-driven, and dead accurate. I've found value in fights where I wouldn't have looked otherwise.",
    name: "Michael Thompson",
    role: "Beta User",
    rating: 5
  };

  // Add intersection observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".section-fade").forEach((section) => {
      observer.observe(section);
    });

    return () => {
      document.querySelectorAll(".section-fade").forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <LivePreviewSection fights={featuredFights} />
      <HowItWorksSection steps={steps} />
      <WhyUseThisSection features={features} />
      <TestimonialSection testimonial={testimonial} />
      <AboutSectionPreview />
      <CTASection />
      <Footer />
    </div>
  );
}
