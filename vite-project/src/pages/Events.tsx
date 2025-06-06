import { useEffect, useState } from "react";
import { CalendarDays, MapPin, ChevronDown, ChevronUp, BarChart, DollarSign, TrendingUp, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { apiService } from "@/services/api";

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
  prediction_data?: any;
}

interface PublicEvent {
  id: string;
  name: string;
  date: string;
  location?: string;
  matches: PublicMatch[];
}

export default function Events() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMatches, setExpandedMatches] = useState<Record<string, boolean>>({});
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    apiService.getPublicEvents()
      .then((data: PublicEvent[]) => {
        setEvents(data);
        if (data.length > 0) setExpandedEvents({ [data[0].id]: true });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleMatchExpansion = (matchId: string) => {
    setExpandedMatches(prev => ({
      ...prev,
      [matchId]: !prev[matchId]
    }));
  };

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(Date.parse(dateString + "T00:00:00Z"));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    });
  };

  const getExpectedValueColor = (value: number) => {
    if (value > 0.15) return "text-[#4DFF91]";
    if (value < -0.15) return "text-[#FF4D4D]";
    return "text-white";
  };

  const getLastName = (fullName: string) => {
    return fullName.split(' ').pop() || fullName;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0A0F16]">
        <Navbar />
        <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-[#9CA3AF]">Loading events...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0F16]">
      <Navbar />
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">UFC Events</h1>
            <p className="text-lg text-[#9CA3AF] max-w-3xl mx-auto">
              View all UFC events with AI-powered fight predictions and odds analysis
            </p>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <div className="flex">
                <div className="flex-1">{error}</div>
                <button
                  onClick={() => setError(null)}
                  className="ml-4 text-red-700 hover:text-red-900"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          {events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-[#9CA3AF]">
                <h3 className="mt-2 text-xl font-medium text-white">No events found</h3>
                <p className="mt-1 text-lg">Events with predictions will appear here.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {events.map((event, eventIndex) => (
                <Card key={event.id} className="bg-[#1E2530] border-0 overflow-hidden shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-[#33C6FF]/20 to-transparent px-6 py-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">{event.name}</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 mt-3 text-[#9CA3AF]">
                          <div className="flex items-center">
                            <CalendarDays className="h-5 w-5 mr-2 text-[#FF4D4D]" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center">
                              <MapPin className="h-5 w-5 mr-2 text-[#33C6FF]" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-2">
                          <span className="text-sm bg-[#33C6FF]/20 text-[#33C6FF] px-2 py-1 rounded">
                            {event.matches?.length || 0} match{(event.matches?.length || 0) !== 1 ? 'es' : ''}
                          </span>
                        </div>
                      </div>
                      {eventIndex > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleEventExpansion(event.id)}
                          className="text-white hover:bg-[#33C6FF]/20"
                        >
                          {expandedEvents[event.id] ? (
                            <ChevronUp className="h-5 w-5 mr-2" />
                          ) : (
                            <ChevronDown className="h-5 w-5 mr-2" />
                          )}
                          {expandedEvents[event.id] ? "Hide Matches" : "Show Matches"}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  {(expandedEvents[event.id] || eventIndex === 0) && (
                    <CardContent className="px-0 py-0">
                      <div className="divide-y divide-gray-700">
                        {event.matches?.map((match) => (
                          <div key={match.id} className="px-6 py-8">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                              {/* Fighters, Predicted Winner, and Match Info Section */}
                              <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0 w-full lg:w-auto">
                                {/* Fighters Side-by-Side with VS */}
                                <div className="flex items-center gap-4">
                                  <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-[#33C6FF]/20 rounded-full flex items-center justify-center mb-2">
                                      <User className="h-5 w-5 text-[#33C6FF]" />
                                    </div>
                                    <div className="text-center w-24">
                                      <p className="text-white font-medium">
                                        {match.fighter1}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="text-xl text-[#E0E0E0] font-bold px-2">VS</div>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-[#FF4D4D]/20 rounded-full flex items-center justify-center mb-2">
                                      <User className="h-5 w-5 text-[#FF4D4D]" />
                                    </div>
                                    <div className="text-center w-24">
                                      <p className="text-white font-medium">
                                        {match.fighter2}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                {/* Predicted Winner Column */}
                                {match.prediction_data?.predictedWinner && (
                                  <div className="flex flex-col items-center gap-2 lg:ml-8 mt-4 sm:mt-0">
                                    <div className="text-[#9CA3AF] text-sm font-medium">
                                      Predicted Winner
                                    </div>
                                    <div className="text-[#4DFF91] text-lg font-bold">
                                      {match.prediction_data.predictedWinner}
                                    </div>
                                  </div>
                                )}
                                {/* Match Info - Weight Class and Result */}
                                <div className="flex flex-col items-center gap-2 lg:ml-8 mt-4 sm:mt-0">
                                  {match.weightclass && (
                                    <div className="text-xs font-medium px-3 py-1 rounded-full bg-[#FFB84D]/20 text-[#FFB84D] min-w-[80px] text-center">
                                      {match.weightclass}
                                    </div>
                                  )}
                                  {match.result !== "pending" && (
                                    <div className={cn(
                                      "text-xs font-medium px-3 py-1 rounded-full min-w-[80px] text-center",
                                      match.result === "hit" ? "bg-[#4DFF91]/20 text-[#4DFF91]" : "bg-[#FF4D4D]/20 text-[#FF4D4D]"
                                    )}>
                                      {match.result.toUpperCase()}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Metrics Section */}
                              {match.prediction_data && (
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-6 lg:mt-0 lg:ml-auto">
                                  {/* Fighter Names Column */}
                                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 min-w-[80px]">
                                    <div className="h-6"></div> {/* Spacer for header */}
                                    <div className="text-[#9CA3AF] text-s text-right py-1">
                                      {getLastName(match.fighter1)}
                                    </div>
                                    <div className="text-[#9CA3AF] text-s text-right py-1">
                                      {getLastName(match.fighter2)}
                                    </div>
                                  </div>
                                  {/* Metrics Grid */}
                                  <div className="grid grid-cols-3 gap-2 sm:gap-6 w-full">
                                    <div className="text-center">
                                      <div className="text-[#9CA3AF] text-sm mb-3 flex items-center justify-center font-medium">
                                        <BarChart className="h-4 w-4 mr-2" />
                                        WIN%
                                      </div>
                                      <div className="space-y-2">
                                        <div className="text-white font-mono text-lg font-bold">
                                          {match.prediction_data.fighter1WinPercent?.toFixed(0) || 0}%
                                        </div>
                                        <div className="text-white font-mono text-lg font-bold">
                                          {match.prediction_data.fighter2WinPercent?.toFixed(0) || 0}%
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-[#9CA3AF] text-sm mb-3 flex items-center justify-center font-medium">
                                        <DollarSign className="h-4 w-4 mr-2" />
                                        ODDS
                                      </div>
                                      <div className="space-y-2">
                                        <div className="text-white font-mono text-lg font-bold">
                                          {match.odds1}
                                        </div>
                                        <div className="text-white font-mono text-lg font-bold">
                                          {match.odds2}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-[#9CA3AF] text-sm mb-3 flex items-center justify-center font-medium">
                                        <TrendingUp className="h-4 w-4 mr-2" />
                                        EV
                                      </div>
                                      <div className="space-y-2">
                                        <div className={cn(
                                          "font-bold text-lg",
                                          getExpectedValueColor(match.prediction_data.fighter1EV || 0)
                                        )}>
                                          {(match.prediction_data.fighter1EV || 0) > 0 
                                            ? `+${match.prediction_data.fighter1EV?.toFixed(1) || 0}%`
                                            : `${match.prediction_data.fighter1EV?.toFixed(1) || 0}%`
                                          }
                                        </div>
                                        <div className={cn(
                                          "font-bold text-lg",
                                          getExpectedValueColor(match.prediction_data.fighter2EV || 0)
                                        )}>
                                          {(match.prediction_data.fighter2EV || 0) > 0
                                            ? `+${match.prediction_data.fighter2EV?.toFixed(1) || 0}%`
                                            : `${match.prediction_data.fighter2EV?.toFixed(1) || 0}%`
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {/* Expand/Collapse Button for Desktop */}
                              <div className="ml-4 hidden lg:block flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleMatchExpansion(match.id)}
                                  className="text-white hover:bg-[#33C6FF]/20"
                                >
                                  {expandedMatches[match.id] ? (
                                    <ChevronUp className="h-6 w-6" />
                                  ) : (
                                    <ChevronDown className="h-6 w-6" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            {/* Expand/Collapse Button for Mobile */}
                            <div className="mt-4 flex justify-center lg:hidden">
                              <Button
                                variant="outline"
                                onClick={() => toggleMatchExpansion(match.id)}
                                className="text-[#33C6FF] border-[#33C6FF]/30 hover:bg-[#33C6FF]/20 w-full"
                              >
                                {expandedMatches[match.id] ? (
                                  <>
                                    Hide Details
                                    <ChevronUp className="ml-2 h-4 w-4" />
                                  </>
                                ) : (
                                  <>
                                    View Detailed Analysis
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                  </>
                                )}
                              </Button>
                            </div>
                            {/* Expanded Details */}
                            {expandedMatches[match.id] && match.prediction_data && (
                              <div className="mt-6 bg-[#182030] rounded-lg p-6 animate-in fade-in slide-in-from-top-5 duration-300">
                                <div className="space-y-6">
                                  {/* Win Method Predictions Only */}
                                  {(match.prediction_data.fighter1MethodPercentages || match.prediction_data.fighter2MethodPercentages) && (
                                    <div>
                                      <h4 className="text-sm font-medium text-[#9CA3AF] mb-4">Win Method Predictions</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {match.prediction_data.fighter1MethodPercentages && (
                                          <div className="bg-[#1E2530] p-4 rounded-lg">
                                            <h5 className="font-medium text-white mb-2">{match.fighter1}</h5>
                                            <div className="space-y-2">
                                              {match.prediction_data.fighter1MethodPercentages.map((method: any, index: number) => (
                                                <div key={index} className="flex justify-between">
                                                  <span className="text-sm text-[#9CA3AF]">{method.method}:</span>
                                                  <span className="text-sm font-medium text-white">{method.percentage.toFixed(1)}%</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        {match.prediction_data.fighter2MethodPercentages && (
                                          <div className="bg-[#1E2530] p-4 rounded-lg">
                                            <h5 className="font-medium text-white mb-2">{match.fighter2}</h5>
                                            <div className="space-y-2">
                                              {match.prediction_data.fighter2MethodPercentages.map((method: any, index: number) => (
                                                <div key={index} className="flex justify-between">
                                                  <span className="text-sm text-[#9CA3AF]">{method.method}:</span>
                                                  <span className="text-sm font-medium text-white">{method.percentage.toFixed(1)}%</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  {/* Feature Importance Graph Only */}
                                  {match.prediction_data.shapPlot && (
                                    <div>
                                      <h4 className="text-sm font-medium text-[#9CA3AF] mb-2">Feature Importance Analysis</h4>
                                      <div className="bg-[#1E2530] p-4 rounded-lg">
                                        <img 
                                          src={match.prediction_data.shapPlot} 
                                          alt="SHAP Feature Analysis"
                                          className="w-full h-auto max-w-4xl mx-auto rounded"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
