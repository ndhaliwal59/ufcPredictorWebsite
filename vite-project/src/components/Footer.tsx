import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#0A0F16] pt-16 pb-10 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/">
              <div className="flex items-center mb-6 cursor-pointer">
                <span className="text-[#FF4D4D] font-bold text-2xl">UFC</span>
                <span className="text-[#33C6FF] font-bold text-2xl">Predictor</span>
              </div>
            </Link>
            <p className="text-[#9CA3AF] mb-8 max-w-md">
              An AI-powered UFC fight prediction platform that uses advanced machine learning to analyze fighter data and compare odds with major sportsbooks.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <div className="text-[#9CA3AF] hover:text-white transition-colors duration-200 cursor-pointer">Home</div>
                </Link>
              </li>
              <li>
                <Link href="/events">
                  <div className="text-[#9CA3AF] hover:text-white transition-colors duration-200 cursor-pointer">Events</div>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works">
                  <div className="text-[#9CA3AF] hover:text-white transition-colors duration-200 cursor-pointer">How It Works</div>
                </Link>
              </li>
              <li>
                <Link href="/login">
                  <div className="text-[#9CA3AF] hover:text-white transition-colors duration-200 cursor-pointer">Admin</div>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-[#9CA3AF] hover:text-white transition-colors duration-200">Kaggle</a></li>
              <li><a href="#" className="text-[#9CA3AF] hover:text-white transition-colors duration-200">GitHub Repository</a></li>
              <li><a href="/how-it-works#methodology" className="text-[#9CA3AF] hover:text-white transition-colors duration-200">Methodology</a></li>
              <li><a href="#" className="text-[#9CA3AF] hover:text-white transition-colors duration-200">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-[#9CA3AF] text-sm">
          <div className="flex flex-col md:flex-row justify-between">
            <p>© {currentYear} UFCPredictor. All rights reserved.</p>
            <p className="mt-2 md:mt-0"><strong>Disclaimer:</strong> Not gambling or betting advice. For entertainment purposes only.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
