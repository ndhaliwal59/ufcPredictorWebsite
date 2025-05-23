import { useState } from "react";
import { CalendarDays, MapPin, ChevronDown, ChevronUp, BarChart, Percent, DollarSign, TrendingUp, User, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EventItem, FightMatch } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function Events() {
  // Sample data for events - would typically come from an API call
  const events: EventItem[] = [
    {
      id: "ufc-300",
      title: "UFC 300: Pereira vs Prochazka",
      date: "May 20, 2023",
      location: "T-Mobile Arena, Las Vegas",
      matches: [
        {
          id: "match-1",
          fighterA: {
            name: "Alex Pereira",
            image: ""
          },
          fighterB: {
            name: "Jiri Prochazka",
            image: ""
          },
          predictedWinner: "A",
          confidence: 72,
          aiOddsA: "-220",
          aiOddsB: "+190",
          bookieOddsA: "-280",
          bookieOddsB: "+240",
          expectedValue: 4.8,
          weightClass: "Light Heavyweight",
          isMainEvent: true
        },
        {
          id: "match-2",
          fighterA: {
            name: "Zhang Weili",
            image: ""
          },
          fighterB: {
            name: "Yan Xiaonan",
            image: ""
          },
          predictedWinner: "A",
          confidence: 85,
          aiOddsA: "-350",
          aiOddsB: "+275",
          bookieOddsA: "-320",
          bookieOddsB: "+260",
          expectedValue: 1.2,
          weightClass: "Women's Strawweight",
          isMainEvent: false
        },
      ]
    },
    {
      id: "ufc-301",
      title: "UFC 301: Oliveira vs Makhachev",
      date: "June 15, 2023",
      location: "Arena da Baixada, Curitiba, Brazil",
      matches: [
        {
          id: "match-3",
          fighterA: {
            name: "Charles Oliveira",
            image: ""
          },
          fighterB: {
            name: "Islam Makhachev",
            image: ""
          },
          predictedWinner: "B",
          confidence: 68,
          aiOddsA: "+160",
          aiOddsB: "-190",
          bookieOddsA: "+200",
          bookieOddsB: "-240",
          expectedValue: 3.2,
          weightClass: "Lightweight",
          isMainEvent: true
        },
        {
          id: "match-4",
          fighterA: {
            name: "Brandon Moreno",
            image: ""
          },
          fighterB: {
            name: "Alexandre Pantoja",
            image: ""
          },
          predictedWinner: "A",
          confidence: 55,
          aiOddsA: "-110",
          aiOddsB: "-110",
          bookieOddsA: "-125",
          bookieOddsB: "+105",
          expectedValue: 1.8,
          weightClass: "Flyweight",
          isMainEvent: false
        },
        {
          id: "match-5",
          fighterA: {
            name: "Gilbert Burns",
            image: ""
          },
          fighterB: {
            name: "Belal Muhammad",
            image: ""
          },
          predictedWinner: "B",
          confidence: 61,
          aiOddsA: "+135",
          aiOddsB: "-160",
          bookieOddsA: "+150",
          bookieOddsB: "-175",
          expectedValue: 0.9,
          weightClass: "Welterweight",
          isMainEvent: false
        }
      ]
    },
    {
      id: "ufc-fight-night",
      title: "UFC Fight Night: Holloway vs Kattar 2",
      date: "July 1, 2023",
      location: "UFC APEX, Las Vegas",
      matches: [
        {
          id: "match-6",
          fighterA: {
            name: "Max Holloway",
            image: ""
          },
          fighterB: {
            name: "Calvin Kattar",
            image: ""
          },
          predictedWinner: "A",
          confidence: 78,
          aiOddsA: "-280",
          aiOddsB: "+230",
          bookieOddsA: "-320",
          bookieOddsB: "+260",
          expectedValue: 2.6,
          weightClass: "Featherweight",
          isMainEvent: true
        },
        {
          id: "match-7",
          fighterA: {
            name: "Geoff Neal",
            image: ""
          },
          fighterB: {
            name: "Ian Machado Garry",
            image: ""
          },
          predictedWinner: "B",
          confidence: 63,
          aiOddsA: "+140",
          aiOddsB: "-165",
          bookieOddsA: "+180",
          bookieOddsB: "-220",
          expectedValue: 4.2,
          weightClass: "Welterweight",
          isMainEvent: false
        }
      ]
    }
  ];

  // State to track which match details are expanded
  const [expandedMatches, setExpandedMatches] = useState<Record<string, boolean>>({});
  
  // State to track which events are expanded (all events after the first one will be collapsed by default)
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({
    "ufc-300": true // First event is expanded by default
  });

  // Toggle match details expansion
  const toggleMatchExpansion = (matchId: string) => {
    setExpandedMatches(prev => ({
      ...prev,
      [matchId]: !prev[matchId]
    }));
  };
  
  // Toggle event expansion
  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0F16]">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Upcoming Events</h1>
            <p className="text-lg text-[#9CA3AF] max-w-3xl mx-auto">
              View all upcoming UFC events with our AI-powered fight predictions and odds comparison
            </p>
          </div>

          {/* Events List */}
          <div className="space-y-12">
            {events.map((event, eventIndex) => (
              <Card key={event.id} className="bg-[#1E2530] border-0 overflow-hidden shadow-xl">
                <CardHeader className="bg-gradient-to-r from-[#33C6FF]/20 to-transparent px-6 py-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white">{event.title}</h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 mt-3 text-[#9CA3AF]">
                        <div className="flex items-center">
                          <CalendarDays className="h-5 w-5 mr-2 text-[#FF4D4D]" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-[#33C6FF]" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Only show toggle button for events after the first one */}
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
                
                {/* Only show event content if it's expanded or it's the first event */}
                {(expandedEvents[event.id] || eventIndex === 0) && (
                  <CardContent className="px-0 py-0">
                    <div className="divide-y divide-gray-700">
                      {event.matches.map((match) => (
                        <div key={match.id} className="px-6 py-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                            {/* Fighter info without images */}
                            <div className="flex items-center gap-4 mb-4 lg:mb-0 flex-grow">
                              <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-[#33C6FF]/20 rounded-full flex items-center justify-center mb-2">
                                  <User className="h-5 w-5 text-[#33C6FF]" />
                                </div>
                                <div className="text-center w-24">
                                  <p className={`text-white font-medium ${match.predictedWinner === 'A' ? 'text-[#4DFF91]' : ''}`}>
                                    {match.fighterA.name}
                                    {match.predictedWinner === 'A' && (
                                      <span className="inline-block ml-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#4DFF91] inline" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </span>
                                    )}
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
                                  <p className={`text-white font-medium ${match.predictedWinner === 'B' ? 'text-[#4DFF91]' : ''}`}>
                                    {match.fighterB.name}
                                    {match.predictedWinner === 'B' && (
                                      <span className="inline-block ml-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#4DFF91] inline" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Weight class and main event badge */}
                              <div className="flex flex-col sm:ml-4">
                                <div className="text-[#9CA3AF] text-sm">{match.weightClass}</div>
                                {match.isMainEvent && (
                                  <div className="bg-[#FF4D4D]/20 text-[#FF4D4D] text-xs font-medium px-2 py-1 rounded-full mt-1">
                                    MAIN EVENT
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Prediction info */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-8">
                              <div className="text-center">
                                <div className="text-[#9CA3AF] text-xs mb-1 flex items-center justify-center">
                                  <Percent className="h-3 w-3 mr-1" />
                                  CONFIDENCE
                                </div>
                                <div className="text-white font-bold text-lg">{match.confidence}%</div>
                              </div>
                              
                              <div className="text-center">
                                <div className="text-[#9CA3AF] text-xs mb-1 flex items-center justify-center">
                                  <BarChart className="h-3 w-3 mr-1" />
                                  AI ODDS
                                </div>
                                <div className="text-white font-mono text-lg">
                                  {match.predictedWinner === 'A' ? match.aiOddsA : match.aiOddsB}
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <div className="text-[#9CA3AF] text-xs mb-1 flex items-center justify-center">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  BOOK ODDS
                                </div>
                                <div className="text-white font-mono text-lg">
                                  {match.predictedWinner === 'A' ? match.bookieOddsA : match.bookieOddsB}
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <div className="text-[#9CA3AF] text-xs mb-1 flex items-center justify-center">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  VALUE
                                </div>
                                <div className={cn(
                                  "font-bold text-lg",
                                  match.expectedValue > 2 ? "text-[#4DFF91]" : 
                                  match.expectedValue > 0 ? "text-white" : "text-[#FF4D4D]"
                                )}>
                                  {match.expectedValue > 0 ? "+" : ""}{match.expectedValue.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            
                            {/* Expand button */}
                            <div className="ml-4 hidden lg:block">
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
                          
                          {/* Mobile expand button */}
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
                                  View Detailed Comparison
                                  <ChevronDown className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                          
                          {/* Expanded details */}
                          {expandedMatches[match.id] && (
                            <div className="mt-6 bg-[#182030] rounded-lg p-6 animate-in fade-in slide-in-from-top-5 duration-300">
                              <h3 className="text-lg font-semibold text-white mb-4">Fighter Comparison</h3>
                              
                              {/* Placeholder for model comparison features */}
                              <div className="space-y-6">
                                {/* Strike stats */}
                                <div>
                                  <h4 className="text-sm font-medium text-[#9CA3AF] mb-2">Significant Strike Stats</h4>
                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="text-right text-white">
                                      <div className="font-bold">73%</div>
                                      <div className="text-xs text-[#9CA3AF]">Accuracy</div>
                                    </div>
                                    <div className="text-center text-[#33C6FF]">Striking</div>
                                    <div className="text-left text-white">
                                      <div className="font-bold">68%</div>
                                      <div className="text-xs text-[#9CA3AF]">Accuracy</div>
                                    </div>
                                  </div>
                                  <div className="h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-[#FF4D4D] h-full rounded-full" style={{ width: "58%" }}></div>
                                  </div>
                                </div>
                                
                                {/* Takedown stats */}
                                <div>
                                  <h4 className="text-sm font-medium text-[#9CA3AF] mb-2">Takedown Defense</h4>
                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="text-right text-white">
                                      <div className="font-bold">82%</div>
                                      <div className="text-xs text-[#9CA3AF]">Defense</div>
                                    </div>
                                    <div className="text-center text-[#33C6FF]">Grappling</div>
                                    <div className="text-left text-white">
                                      <div className="font-bold">90%</div>
                                      <div className="text-xs text-[#9CA3AF]">Defense</div>
                                    </div>
                                  </div>
                                  <div className="h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-[#33C6FF] h-full rounded-full" style={{ width: "65%" }}></div>
                                  </div>
                                </div>
                                
                                {/* Win method prediction */}
                                <div>
                                  <h4 className="text-sm font-medium text-[#9CA3AF] mb-2">Win Method Prediction</h4>
                                  <div className="grid grid-cols-2 gap-4 bg-[#1E2530] rounded-lg p-4">
                                    <div className="text-center">
                                      <div className="text-sm font-medium text-[#9CA3AF]">
                                        {match.predictedWinner === 'A' ? match.fighterA.name : match.fighterB.name}
                                      </div>
                                      <div className="text-white mt-1">By Decision (65%)</div>
                                      <div className="text-[#9CA3AF] text-xs mt-1">KO/TKO (25%) • Submission (10%)</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-sm font-medium text-[#9CA3AF]">Round Prediction</div>
                                      <div className="text-white mt-1">Goes the Distance (70%)</div>
                                      <div className="text-[#9CA3AF] text-xs mt-1">Round 3 (15%) • Round 2 (10%) • Round 1 (5%)</div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* AI explanation */}
                                <div>
                                  <h4 className="text-sm font-medium text-[#9CA3AF] mb-2">AI Explanation</h4>
                                  <div className="bg-[#1E2530] rounded-lg p-4 text-[#E0E0E0]">
                                    <p>Our model predicts {match.predictedWinner === 'A' ? match.fighterA.name : match.fighterB.name} to win based on superior striking accuracy, takedown defense, and recent performance metrics. This fighter has demonstrated consistent improvement in recent bouts and matches up well against their opponent's known vulnerabilities.</p>
                                  </div>
                                </div>
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
}