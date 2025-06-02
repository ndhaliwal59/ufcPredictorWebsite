import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, TrendingUp, DollarSign } from "lucide-react";
import { FightPrediction } from "@/lib/types";

interface LivePreviewSectionProps {
  fights: FightPrediction[];
  loading?: boolean;
  error?: string | null;
}

export default function LivePreviewSection({ fights, loading = false, error = null }: LivePreviewSectionProps) {
  console.log("LivePreviewSection render:", { fights: fights.length, loading, error });

  // Function to get last name from full name
  const getLastName = (fullName: string) => {
    return fullName?.split(' ').pop() || fullName || "";
  };

  // Function to get EV color based on value
  const getExpectedValueColor = (value: number) => {
    if (value > 0.15) return "text-[#4DFF91]";
    if (value < -0.15) return "text-[#FF4D4D]";
    return "text-white";
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1E2530]/30" id="events">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Featured Fights</h2>
          <p className="mt-4 text-lg text-[#9CA3AF] max-w-2xl mx-auto">
            Live preview of our AI predictions compared to sportsbook odds
          </p>
        </div>

        {!loading && fights && fights.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8">
            {fights.map((fight, index) => (
              <Card key={index} className="bg-[#1E2530] border-0 overflow-hidden shadow-xl">
                <CardHeader className="bg-gradient-to-r from-[#33C6FF]/20 to-transparent px-6 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">{fight.event}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{fight.fighterA.name} vs. {fight.fighterB.name}</h3>
                </CardHeader>

                <CardContent className="px-6 py-6">
                  {/* Fighters */}
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-[#33C6FF]/20 rounded-full flex items-center justify-center mb-2">
                        <User className="h-6 w-6 text-[#33C6FF]" />
                      </div>
                      <p className="text-sm font-semibold text-white text-center">{fight.fighterA.name}</p>
                    </div>
                    <div className="text-xl text-[#E0E0E0] font-bold px-4">VS</div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-[#FF4D4D]/20 rounded-full flex items-center justify-center mb-2">
                        <User className="h-6 w-6 text-[#FF4D4D]" />
                      </div>
                      <p className="text-sm font-semibold text-white text-center">{fight.fighterB.name}</p>
                    </div>
                  </div>
                  
                  {/* AI Win Prediction */}
                  <div className="mb-6">
                    <p className="text-sm text-[#9CA3AF] mb-2">AI Win Prediction</p>
                    <div className="flex items-center h-6 rounded-full bg-gray-700 overflow-hidden relative">
                      <div 
                        className="h-full bg-[#33C6FF] transition-all duration-1000 ease-out" 
                        style={{ width: `${fight.predictionA}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-[#E0E0E0]">{Math.round(fight.predictionA)}%</span>
                      <span className="text-sm text-[#E0E0E0]">{Math.round(fight.predictionB)}%</span>
                    </div>
                  </div>

                {/* Odds Comparison */}
                <div>
                  <p className="text-sm text-[#9CA3AF] mb-2">Odds & EV</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#182030] px-3 py-4 rounded-lg">
                      <p className="text-xs text-[#9CA3AF] mb-1">{getLastName(fight.fighterA.name)}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-[#9CA3AF]" />
                          <span className="text-sm font-mono font-medium text-white">{fight.ourOddsA}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-[#9CA3AF]" />
                          <span className={`text-sm font-mono ${getExpectedValueColor(fight.evA || 0)}`}>
                            {(fight.evA || 0) > 0 ? '+' : ''}{(fight.evA || 0).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#182030] px-3 py-4 rounded-lg">
                      <p className="text-xs text-[#9CA3AF] mb-1">{getLastName(fight.fighterB.name)}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-[#9CA3AF]" />
                          <span className="text-sm font-mono font-medium text-white">{fight.ourOddsB}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-[#9CA3AF]" />
                          <span className={`text-sm font-mono ${getExpectedValueColor(fight.evB || 0)}`}>
                            {(fight.evB || 0) > 0 ? '+' : ''}{(fight.evB || 0).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && (!fights || fights.length === 0) && !error && (
          <div className="text-center py-12">
            <div className="text-lg text-[#9CA3AF]">No featured fights available at the moment.</div>
          </div>
        )}

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
