import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FightPrediction } from "@/lib/types";

interface LivePreviewSectionProps {
  fights: FightPrediction[];
}

export default function LivePreviewSection({ fights }: LivePreviewSectionProps) {
  const progressBarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.progress-bar');
            progressBars.forEach(bar => {
              bar.classList.add('animate');
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (progressBarsRef.current) {
      observer.observe(progressBarsRef.current);
    }

    return () => {
      if (progressBarsRef.current) {
        observer.unobserve(progressBarsRef.current);
      }
    };
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1E2530]/30" id="events">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 section-fade">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Featured Fights</h2>
          <p className="mt-4 text-lg text-[#9CA3AF] max-w-2xl mx-auto">
            Live preview of our AI predictions compared to sportsbook odds
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 section-fade" ref={progressBarsRef}>
          {fights.map((fight, index) => (
            <div key={index} className="bg-[#1E2530] rounded-xl overflow-hidden shadow-lg card">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-[#9CA3AF]">{fight.event} • {fight.type}</span>
                  {fight.hasValue ? (
                    <span className="bg-[#4DFF91]/20 text-[#4DFF91] text-xs font-medium px-2 py-1 rounded-full">VALUE FOUND</span>
                  ) : (
                    <span className="bg-gray-700 text-[#9CA3AF] text-xs font-medium px-2 py-1 rounded-full">FAIR ODDS</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{fight.fighterA.name} vs. {fight.fighterB.name}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <img src={fight.fighterA.image} alt={fight.fighterA.name} className="w-20 h-20 object-cover rounded-full mx-auto mb-2" />
                    <p className="text-sm font-semibold text-white">{fight.fighterA.name}</p>
                  </div>
                  <div className="text-center">
                    <img src={fight.fighterB.image} alt={fight.fighterB.name} className="w-20 h-20 object-cover rounded-full mx-auto mb-2" />
                    <p className="text-sm font-semibold text-white">{fight.fighterB.name}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-[#9CA3AF] mb-2">AI Win Prediction</p>
                  <div className="flex items-center h-6 rounded-full bg-gray-700 overflow-hidden relative">
                    <div 
                      className="h-full bg-[#FF4D4D] progress-bar" 
                      style={{ '--progress-width': `${fight.predictionA}%` } as React.CSSProperties}
                    ></div>
                    <div 
                      className="h-full bg-[#33C6FF] progress-bar absolute right-0" 
                      style={{ '--progress-width': `${fight.predictionB}%` } as React.CSSProperties}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-[#E0E0E0]">{fight.predictionA}%</span>
                    <span className="text-sm text-[#E0E0E0]">{fight.predictionB}%</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-[#9CA3AF] mb-2">Odds Comparison</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <p className="text-xs text-[#9CA3AF]">Our Odds</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm font-mono font-medium text-white">{fight.ourOddsA}</span>
                        <span className="text-sm font-mono font-medium text-white">{fight.ourOddsB}</span>
                      </div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <p className="text-xs text-[#9CA3AF]">Sportsbook</p>
                      <div className="flex justify-between mt-1">
                        <span className={`text-sm font-mono font-medium ${fight.valueOn === 'A' ? 'text-[#4DFF91]' : 'text-white'}`}>
                          {fight.bookieOddsA}
                        </span>
                        <span className={`text-sm font-mono font-medium ${fight.valueOn === 'B' ? 'text-[#4DFF91]' : 'text-white'}`}>
                          {fight.bookieOddsB}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="gradient-button text-white px-8 py-3 rounded-lg font-bold text-lg h-auto">
            <a href="/events">
              View All Upcoming Events
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
