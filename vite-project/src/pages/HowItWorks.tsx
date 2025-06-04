import { useState } from "react";
import { 
  Database, Brain, BarChart3, ArrowDown, PieChart, Workflow, 
  CheckCircle, HelpCircle, ChevronDown, ChevronUp
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/lib/types";
import featureGraph from '../assets/feature_graph.png';
import matrix from '../assets/confusion_matrix.png';
import curve from '../assets/learning_curve.png';

export default function HowItWorks() {
  // Sample FAQ data
  const faqs: FAQ[] = [
    {
      question: "How accurate is the model?",
      answer: "The model currently has an accuracy rate of 67.41% based on historical UFC fight data. We’re still in the process of collecting more real-world data and actively testing the system to further validate and improve performance over time."
    },
    {
      question: "Why not use other models with higher accuracy?",
      answer: "While some models — particularly neural networks — can show higher accuracy during testing, they often suffer from issues like data leakage and overfitting, especially if the data isn't sorted chronologically. Additionally, decision tree-based models can develop a bias toward the first fighter listed (often the red corner), who statistically wins around 60-65% of the time. My selected model may not have the absolute highest accuracy, but it avoids these pitfalls and provides the most reliable and time-aware predictions in real-world scenarios."
    },
    {
      question: "Where do you get your data?",
      answer: "We collect data from ufcstats.com, compiling comprehensive fight statistics, fighter histories, and performance metrics. All data is scraped from public sources and processed through our proprietary cleaning pipeline to ensure consistency and accuracy."
    },
    {
      question: "How often are predictions updated?",
      answer: "Predictions are updated weekly, with additional updates occurring before each UFC event as new information becomes available (such as weigh-in results, last-minute injuries, or other relevant factors that might impact fight outcomes)."
    },
    {
      question: "Is this project open-source?",
      answer: "Yes, this project is fully open-source. The code for the website is available on GitHub, and the entire process of building the fight outcome predictor — including data collection, cleaning, feature engineering, and model training — is documented and shared on Kaggle. Links can be found in the footer"
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
                      I’ve developed custom Python scripts that I manually run to scrape up-to-date fight statistics from ufcstats.com. These scripts form the foundation of the data powering my models.
                    </p>
                    <ul className="list-disc pl-5 text-[#E0E0E0] space-y-2">
                      <li>Scraping fighter data and fight records from UFCStats.com</li>
                      <li>Fighter biographical details and physical attributes</li>
                      <li>Performance metrics from past matchups</li>
                      <li>Historical results and methods of victory</li>
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
                      Raw data undergoes cleaning and transformation to ensure consistency and usability:
                    </p>
                    <ul className="list-disc pl-5 text-[#E0E0E0] space-y-2">
                      <li>Handling missing values and removing outliers</li>
                      <li>Standardizing formats: converting percentages to decimals and time to seconds</li>
                      <li>Normalizing numerical features for better model performance</li>
                      <li>Encoding categorical variables like stance and outcome types</li>
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
                      <li>Calculated advanced metrics like estimated moving averages (EMA) for various features</li>
                      <li>Generating relative performance indicators between fighters</li>
                      <li>Creating age-adjusted features to capture career trajectories</li>
                      <li>Building matchup-specific stats to reflect fighter advantages and tendencies</li>
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
                      Training and evaluating multiple machine learning models to identify the best performer:
                    </p>
                    <ul className="list-disc pl-5 text-[#E0E0E0] space-y-2">
                      <li>Tested multiple models and got the best performance form XGBoost</li>
                      <li>Cross-validation to prevent overfitting</li>
                      <li>Hyperparameter optimization for model tuning</li>
                      <li>Backtested on historical fight data to assess real-world performance</li>
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
                      <li>Probability estimates for each fighter's victory and method of victory</li>
                      <li>Expected Value calculations using probability</li>
                      <li>Model interpretation through SHAP value plots to explain prediction reasoning</li>
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
                <h3 className="text-xl font-bold text-white mb-4">Model Performance</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <p className="text-[#E0E0E0] mb-4 md:col-span-2">
                    Our XGBoost model performance metrics evaluated on test data, showing precision, recall, and F1-scores for both classes in UFC fight outcome prediction.
                  </p>
                  
                  {/* Class 0 Metrics */}
                  <div className="bg-[#182030] rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Class 0 Performance</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-[#9CA3AF]">Precision</span>
                          <span className="text-sm text-white font-medium">68.2%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-[#33C6FF] h-2.5 rounded-full" style={{ width: '68.2%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-[#9CA3AF]">Recall</span>
                          <span className="text-sm text-white font-medium">67.4%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-[#4DFF91] h-2.5 rounded-full" style={{ width: '67.4%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-[#9CA3AF]">F1-Score</span>
                          <span className="text-sm text-white font-medium">67.8%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-[#FF4D4D] h-2.5 rounded-full" style={{ width: '67.8%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Class 1 Metrics */}
                  <div className="bg-[#182030] rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Class 1 Performance</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-[#9CA3AF]">Precision</span>
                          <span className="text-sm text-white font-medium">66.6%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-[#33C6FF] h-2.5 rounded-full" style={{ width: '66.6%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-[#9CA3AF]">Recall</span>
                          <span className="text-sm text-white font-medium">67.4%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-[#4DFF91] h-2.5 rounded-full" style={{ width: '67.4%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-[#9CA3AF]">F1-Score</span>
                          <span className="text-sm text-white font-medium">67.0%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div className="bg-[#FF4D4D] h-2.5 rounded-full" style={{ width: '67.0%' }}></div>
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
                  <h3 className="text-xl font-bold text-white mb-4">Features Importance</h3>
                  <p className="text-[#E0E0E0] mb-6">
                    Our model analyzes 173 distinct features for each fighter and matchup. Here are the most influential features:
                  </p>
                  <div className="mb-6">
                    <img 
                      src= {featureGraph}
                      alt="Top 20 Most Important Features"
                      className="w-full h-auto rounded-lg border border-gray-600"
                    />
                  </div>
                </div>
              </Card>
              
              {/* Visualization Placeholder */}
              <Card className="bg-[#1E2530] border-0 overflow-hidden">
                <div className="p-6" >
                  <h3 className="text-xl font-bold text-white mb-4">Model Performance Visualization</h3>
                  <div className="flex flex-col space-y-6">
                    <img 
                      src={curve} 
                      alt="Learning Curve" 
                      className="w-full h-auto rounded-lg border border-gray-600" 
                    />
                    <img 
                      src={matrix} 
                      alt="Confusion Matrix" 
                      className="w-full h-auto rounded-lg border border-gray-600" 
                    />
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
                      className="w-full flex justify-between items-center text-left p-0 h-auto hover:bg-transparent"
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