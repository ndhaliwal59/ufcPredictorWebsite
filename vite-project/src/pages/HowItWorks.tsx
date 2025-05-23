import { useState } from "react";
import { 
  Database, Brain, BarChart3, ArrowDown, PieChart, Workflow, 
  CheckCircle, HelpCircle, ChevronDown, ChevronUp, LineChart
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/lib/types";

export default function HowItWorks() {
  // Sample FAQ data
  const faqs: FAQ[] = [
    {
      question: "How accurate is the model?",
      answer: "Our model has demonstrated an accuracy rate of 68.7% across all UFC fights in the past 24 months. This accuracy varies by weight class and fight type, with title fights having a slightly higher prediction accuracy of 72.3%. We continuously update and refine our models with each event to improve performance."
    },
    {
      question: "Where do you get your data?",
      answer: "We collect data from multiple official UFC statistics providers, compiling comprehensive fight statistics, fighter histories, and performance metrics. All data is ethically scraped from public sources and processed through our proprietary cleaning pipeline to ensure consistency and accuracy."
    },
    {
      question: "How often are predictions updated?",
      answer: "Predictions are updated weekly, with additional updates occurring before each UFC event as new information becomes available (such as weigh-in results, last-minute injuries, or other relevant factors that might impact fight outcomes)."
    }
  ];

  // State to track which FAQ items are expanded
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({
    0: true
  });

  // Toggle FAQ expansion
  const toggleFaq = (index: number) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0F16]">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero/Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">How Our Predictions Work</h1>
            <p className="text-lg text-[#9CA3AF] max-w-3xl mx-auto">
              A deep dive into our AI model, its architecture, and how we generate accurate UFC fight predictions
            </p>
          </div>
          
          {/* Pipeline Overview Section */}
          <section className="mb-20">
            <div className="flex items-center mb-6">
              <Workflow className="h-7 w-7 text-[#FF4D4D] mr-3" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Pipeline Overview</h2>
            </div>
            <Separator className="mb-8 bg-gray-800" />
            
            <div className="space-y-8">
              {/* Step 1: Data Collection */}
              <Card className="bg-[#1E2530] border-0 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#33C6FF]/20 flex items-center justify-center mr-4">
                      <Database className="h-5 w-5 text-[#33C6FF]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Data Scraping & Collection</h3>
                  </div>
                  <div className="pl-14">
                    <p className="text-[#E0E0E0] mb-4">
                      Our data collection system gathers comprehensive fight statistics from multiple sources:
                    </p>
                    <ul className="list-disc pl-5 text-[#E0E0E0] space-y-2">
                      <li>Fighter biographical information and physical attributes</li>
                      <li>Detailed performance metrics from previous fights</li>
                      <li>Historical fight outcomes and methods of victory</li>
                      <li>Betting odds from major sportsbooks</li>
                    </ul>
                  </div>
                </div>
              </Card>
              
              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowDown className="h-8 w-8 text-[#9CA3AF]" />
              </div>
              
              {/* Step 2: Data Cleaning */}
              <Card className="bg-[#1E2530] border-0 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#4DFF91]/20 flex items-center justify-center mr-4">
                      <CheckCircle className="h-5 w-5 text-[#4DFF91]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Cleaning & Preprocessing</h3>
                  </div>
                  <div className="pl-14">
                    <p className="text-[#E0E0E0] mb-4">
                      Raw data undergoes rigorous cleaning and standardization:
                    </p>
                    <ul className="list-disc pl-5 text-[#E0E0E0] space-y-2">
                      <li>Handling missing values and outliers</li>
                      <li>Normalizing statistics across different fight durations</li>
                      <li>Converting categorical variables to numerical representations</li>
                      <li>Implementing data quality checks and validation</li>
                    </ul>
                  </div>
                </div>
              </Card>
              
              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowDown className="h-8 w-8 text-[#9CA3AF]" />
              </div>
              
              {/* Step 3: Feature Engineering */}
              <Card className="bg-[#1E2530] border-0 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#FF4D4D]/20 flex items-center justify-center mr-4">
                      <PieChart className="h-5 w-5 text-[#FF4D4D]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Feature Engineering</h3>
                  </div>
                  <div className="pl-14">
                    <p className="text-[#E0E0E0] mb-4">
                      Creating meaningful features from the raw data:
                    </p>
                    <ul className="list-disc pl-5 text-[#E0E0E0] space-y-2">
                      <li>Calculating advanced metrics (e.g., striking efficiency, defensive rating)</li>
                      <li>Generating relative performance indicators between fighters</li>
                      <li>Creating time-based features to capture career trajectories</li>
                      <li>Style matchup analysis and historical pattern recognition</li>
                    </ul>
                  </div>
                </div>
              </Card>
              
              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowDown className="h-8 w-8 text-[#9CA3AF]" />
              </div>
              
              {/* Step 4: Model Training */}
              <Card className="bg-[#1E2530] border-0 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#33C6FF]/20 flex items-center justify-center mr-4">
                      <Brain className="h-5 w-5 text-[#33C6FF]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Model Training & Testing</h3>
                  </div>
                  <div className="pl-14">
                    <p className="text-[#E0E0E0] mb-4">
                      Training our machine learning models with rigorous validation:
                    </p>
                    <ul className="list-disc pl-5 text-[#E0E0E0] space-y-2">
                      <li>Ensemble of gradient-boosted trees and neural networks</li>
                      <li>Cross-validation to prevent overfitting</li>
                      <li>Hyperparameter optimization for model tuning</li>
                      <li>Backtesting against historical fight outcomes</li>
                    </ul>
                  </div>
                </div>
              </Card>
              
              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowDown className="h-8 w-8 text-[#9CA3AF]" />
              </div>
              
              {/* Step 5: Prediction Generation */}
              <Card className="bg-[#1E2530] border-0 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#4DFF91]/20 flex items-center justify-center mr-4">
                      <BarChart3 className="h-5 w-5 text-[#4DFF91]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Generating Predictions</h3>
                  </div>
                  <div className="pl-14">
                    <p className="text-[#E0E0E0] mb-4">
                      Final output generation process:
                    </p>
                    <ul className="list-disc pl-5 text-[#E0E0E0] space-y-2">
                      <li>Probability estimates for each fighter's victory</li>
                      <li>Conversion to implied odds and comparison with sportsbooks</li>
                      <li>Value calculation based on probability and offered odds</li>
                      <li>Confidence rating and prediction explanation generation</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </section>
          
          {/* About the Model Section */}
          <section className="mb-20">
            <div className="flex items-center mb-6">
              <Brain className="h-7 w-7 text-[#FF4D4D] mr-3" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">About the Model</h2>
            </div>
            <Separator className="mb-8 bg-gray-800" />
            
            <div className="space-y-8">
              {/* Model Accuracy */}
              <Card className="bg-[#1E2530] border-0 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Model Accuracy</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-[#E0E0E0] mb-4">
                        Our model has been tested against thousands of historical UFC fights, demonstrating consistent predictive power across different weight classes and fight types.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-[#9CA3AF]">Overall Accuracy</span>
                            <span className="text-sm text-white font-medium">68.7%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-[#33C6FF] h-2.5 rounded-full" style={{ width: '68.7%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-[#9CA3AF]">Title Fight Accuracy</span>
                            <span className="text-sm text-white font-medium">72.3%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-[#33C6FF] h-2.5 rounded-full" style={{ width: '72.3%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-[#9CA3AF]">Value Bet Accuracy</span>
                            <span className="text-sm text-white font-medium">61.5%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-[#4DFF91] h-2.5 rounded-full" style={{ width: '61.5%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#182030] rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3">Accuracy by Weight Class</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[#9CA3AF]">Heavyweight</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-700 rounded-full h-2 mr-2">
                              <div className="bg-[#FF4D4D] h-2 rounded-full" style={{ width: '63%' }}></div>
                            </div>
                            <span className="text-white text-sm">63%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#9CA3AF]">Light Heavyweight</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-700 rounded-full h-2 mr-2">
                              <div className="bg-[#FF4D4D] h-2 rounded-full" style={{ width: '67%' }}></div>
                            </div>
                            <span className="text-white text-sm">67%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#9CA3AF]">Middleweight</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-700 rounded-full h-2 mr-2">
                              <div className="bg-[#FF4D4D] h-2 rounded-full" style={{ width: '69%' }}></div>
                            </div>
                            <span className="text-white text-sm">69%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#9CA3AF]">Welterweight</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-700 rounded-full h-2 mr-2">
                              <div className="bg-[#FF4D4D] h-2 rounded-full" style={{ width: '71%' }}></div>
                            </div>
                            <span className="text-white text-sm">71%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#9CA3AF]">Lightweight</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-700 rounded-full h-2 mr-2">
                              <div className="bg-[#33C6FF] h-2 rounded-full" style={{ width: '72%' }}></div>
                            </div>
                            <span className="text-white text-sm">72%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#9CA3AF]">Featherweight</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-700 rounded-full h-2 mr-2">
                              <div className="bg-[#33C6FF] h-2 rounded-full" style={{ width: '70%' }}></div>
                            </div>
                            <span className="text-white text-sm">70%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#9CA3AF]">Bantamweight</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-700 rounded-full h-2 mr-2">
                              <div className="bg-[#33C6FF] h-2 rounded-full" style={{ width: '68%' }}></div>
                            </div>
                            <span className="text-white text-sm">68%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#9CA3AF]">Flyweight</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-700 rounded-full h-2 mr-2">
                              <div className="bg-[#33C6FF] h-2 rounded-full" style={{ width: '69%' }}></div>
                            </div>
                            <span className="text-white text-sm">69%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Features Used */}
              <Card className="bg-[#1E2530] border-0 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Features Used</h3>
                  <p className="text-[#E0E0E0] mb-6">
                    Our model analyzes over 200 distinct features for each fighter and matchup. Here are the major categories of features and their relative importance:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-[#9CA3AF]">Strike Statistics</span>
                          <span className="text-sm text-white font-medium">27%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-[#FF4D4D] h-2.5 rounded-full" style={{ width: '27%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-[#9CA3AF]">Grappling Metrics</span>
                          <span className="text-sm text-white font-medium">23%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-[#FF4D4D] h-2.5 rounded-full" style={{ width: '23%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-[#9CA3AF]">Fight History</span>
                          <span className="text-sm text-white font-medium">18%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-[#33C6FF] h-2.5 rounded-full" style={{ width: '18%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-[#9CA3AF]">Physical Attributes</span>
                          <span className="text-sm text-white font-medium">12%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-[#33C6FF] h-2.5 rounded-full" style={{ width: '12%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-[#9CA3AF]">Form & Momentum</span>
                          <span className="text-sm text-white font-medium">11%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-[#33C6FF] h-2.5 rounded-full" style={{ width: '11%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-[#9CA3AF]">Stylistic Matchup</span>
                          <span className="text-sm text-white font-medium">9%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-[#4DFF91] h-2.5 rounded-full" style={{ width: '9%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#182030] rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3">Key Performance Indicators</h4>
                      <ul className="list-disc pl-5 text-[#E0E0E0] space-y-2">
                        <li>Significant strikes landed per minute</li>
                        <li>Striking accuracy percentage</li>
                        <li>Takedown defense rate</li>
                        <li>Submission attempts per 15 minutes</li>
                        <li>Strike differential (landed vs. absorbed)</li>
                        <li>Knockout/submission ratio</li>
                        <li>Average fight time</li>
                        <li>Recovery capability metrics</li>
                        <li>Performance against common opponents</li>
                        <li>Win streak and quality of opposition</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Visualization Placeholder */}
              <Card className="bg-[#1E2530] border-0 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Model Performance Visualization</h3>
                  <div className="bg-[#182030] rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px]">
                    <LineChart className="h-16 w-16 text-[#33C6FF] mb-4" />
                    <p className="text-[#9CA3AF] text-center max-w-md">
                      This space will contain interactive visualization charts showing model performance over time, ROI metrics, and prediction accuracy by different fight factors (weight class, fight style, etc.)
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>
          
          {/* FAQ Section */}
          <section>
            <div className="flex items-center mb-6">
              <HelpCircle className="h-7 w-7 text-[#FF4D4D] mr-3" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions</h2>
            </div>
            <Separator className="mb-8 bg-gray-800" />
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-[#1E2530] border-0 overflow-hidden">
                  <div className="p-6">
                    <Button
                      variant="ghost"
                      className="w-full flex justify-between items-center text-left p-0 h-auto"
                      onClick={() => toggleFaq(index)}
                    >
                      <span className="text-lg font-medium text-white">{faq.question}</span>
                      {expandedFaqs[index] ? (
                        <ChevronUp className="h-5 w-5 text-[#9CA3AF]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-[#9CA3AF]" />
                      )}
                    </Button>
                    
                    {expandedFaqs[index] && (
                      <div className="mt-4 text-[#E0E0E0] animate-in fade-in-50 duration-300">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}