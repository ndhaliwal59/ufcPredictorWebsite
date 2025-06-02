import { useEffect, useState } from "react";
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
import { apiService } from "@/services/api";
import myImage from '../assets/merab.jpg';

// Interface matching your Events page data structure
interface PublicMatch {
  id: string;
  fighter1: string;
  fighter2: string;
  odds1: string;
  odds2: string;
  referee: string;
  weightclass?: string;
  event_date: string;
  result: "pending" | "hit" | "miss";
  prediction_data?: {
    predictedWinner: string;
    fighter1WinPercent: number;
    fighter2WinPercent: number;
    fighter1EV: number;
    fighter2EV: number;
  };
}

interface PublicEvent {
  id: string;
  name: string;
  date: string;
  location?: string;
  matches: PublicMatch[];
}

export default function Home() {
  const [featuredFights, setFeaturedFights] = useState<FightPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to convert match data to FightPrediction format
  const convertMatchToFightPrediction = (match: PublicMatch, eventName: string): FightPrediction | null => {
    try {
      console.log("Converting match:", match);
      
      // Validate required fields
      if (!match.fighter1 || !match.fighter2) {
        console.warn("Missing fighter names:", match);
        return null;
      }

      const result: FightPrediction = {
        fighterA: { 
          name: match.fighter1, 
          image: "https://pixabay.com/get/g6286cadc69d4c47e40097c98ea4a7b5d7029a6baa53c8eb621746d408fcd472b0796ef0e432b30be82b9b0d18990c081d1c0b916f78ff40b479f991279885f73_1280.jpg" 
        },
        fighterB: { 
          name: match.fighter2, 
          image: "https://pixabay.com/get/g6286cadc69d4c47e40097c98ea4a7b5d7029a6baa53c8eb621746d408fcd472b0796ef0e432b30be82b9b0d18990c081d1c0b916f78ff40b479f991279885f73_1280.jpg" 
        },
        predictionA: match.prediction_data?.fighter1WinPercent || 50,
        predictionB: match.prediction_data?.fighter2WinPercent || 50,
        ourOddsA: match.odds1 || "+100",
        ourOddsB: match.odds2 || "+100",
        bookieOddsA: match.odds1 || "+100",
        bookieOddsB: match.odds2 || "+100",
        evA: match.prediction_data?.fighter1EV || 0,
        evB: match.prediction_data?.fighter2EV || 0,
        hasValue: (match.prediction_data?.fighter1EV || 0) > 0.1 || (match.prediction_data?.fighter2EV || 0) > 0.1,
        valueOn: (match.prediction_data?.fighter1EV || 0) > (match.prediction_data?.fighter2EV || 0) ? 'A' : 'B',
        event: eventName || "UFC Event",
        type: match.weightclass || "Main Card"
      };

      console.log("Converted successfully:", result);
      return result;
    } catch (error) {
      console.error("Error converting match data:", error, match);
      return null;
    }
  };

  // Function to get 3 random fights from all events
  const getRandomFights = (events: PublicEvent[]): FightPrediction[] => {
    try {
      console.log("Processing events:", events);
      
      if (!events || events.length === 0) {
        console.log("No events provided");
        return [];
      }

      const allMatches: { match: PublicMatch; eventName: string }[] = [];
      
      events.forEach(event => {
        console.log("Processing event:", event.name, "with matches:", event.matches?.length || 0);
        
        if (event.matches && Array.isArray(event.matches)) {
          event.matches.forEach(match => {
            console.log("Checking match:", match.fighter1, "vs", match.fighter2, "result:", match.result, "has prediction:", !!match.prediction_data);
            
            // More lenient filtering - include matches with any result for now
            if (match && match.fighter1 && match.fighter2) {
              allMatches.push({ match, eventName: event.name });
            }
          });
        }
      });

      console.log("Total valid matches found:", allMatches.length);

      if (allMatches.length === 0) {
        console.log("No valid matches found");
        return [];
      }

      // Shuffle and take up to 3 random matches
      const shuffled = allMatches.sort(() => 0.5 - Math.random());
      const selectedMatches = shuffled.slice(0, Math.min(3, allMatches.length));
      
      console.log("Selected matches:", selectedMatches.length);

      const convertedFights = selectedMatches
        .map(({ match, eventName }) => convertMatchToFightPrediction(match, eventName))
        .filter((fight): fight is FightPrediction => fight !== null);

      console.log("Successfully converted fights:", convertedFights.length);
      return convertedFights;
    } catch (error) {
      console.error("Error getting random fights:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching events...");
        const data = await apiService.getPublicEvents();
        console.log("Raw API Data:", data);
        
        if (data && Array.isArray(data)) {
          const randomFights = getRandomFights(data);
          console.log("Final random fights:", randomFights);
          
          if (randomFights.length > 0) {
            setFeaturedFights(randomFights);
          } else {
            console.log("No fights found, using fallback");
            // Create a simple fallback fight
            const fallbackFight: FightPrediction = {
              fighterA: { 
                name: "Fighter A", 
                image: "https://pixabay.com/get/g6286cadc69d4c47e40097c98ea4a7b5d7029a6baa53c8eb621746d408fcd472b0796ef0e432b30be82b9b0d18990c081d1c0b916f78ff40b479f991279885f73_1280.jpg" 
              },
              fighterB: { 
                name: "Fighter B", 
                image: "https://pixabay.com/get/g6286cadc69d4c47e40097c98ea4a7b5d7029a6baa53c8eb621746d408fcd472b0796ef0e432b30be82b9b0d18990c081d1c0b916f78ff40b479f991279885f73_1280.jpg" 
              },
              predictionA: 60,
              predictionB: 40,
              ourOddsA: "-150",
              ourOddsB: "+130",
              bookieOddsA: "-150",
              bookieOddsB: "+130",
              evA: 5.2,
              evB: -2.1,
              hasValue: true,
              valueOn: 'A',
              event: "Sample Event",
              type: "Main Card"
            };
            setFeaturedFights([fallbackFight]);
          }
        } else {
          console.error("Invalid data format:", data);
          setError("Invalid data format received");
          setFeaturedFights([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
        setFeaturedFights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      title: "Insights",
      description: "We use predicted win percentages to evaluate sportsbook odds and uncover positive expected value (EV) opportunities.",
      bgColor: "bg-[#4DFF91]/20",
      iconColor: "text-[#4DFF91]",
      image: myImage
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
    name: "Parteek Sandhu",
    role: "User",
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

  console.log("Rendering Home with featured fights:", featuredFights.length);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <LivePreviewSection fights={featuredFights} loading={loading} error={error} />
      <HowItWorksSection steps={steps} />
      <WhyUseThisSection features={features} />
      <TestimonialSection testimonial={testimonial} />
      <AboutSectionPreview />
      <CTASection />
      <Footer />
    </div>
  );
}
