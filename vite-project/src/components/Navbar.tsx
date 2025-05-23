import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "How It Works", href: "/how-it-works" },
  ];

  // Check if a nav link is active
  const isActive = (path: string) => {
    // For homepage sections like #about, only check if we're on the homepage
    if (path.startsWith('/#')) {
      return location === '/';
    }
    // For regular pages, check exact match
    return location === path;
  };

  return (
    <nav className="bg-[#0A0F16] border-b border-gray-800 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <span className="text-[#FF4D4D] font-bold text-2xl">UFC</span>
                <span className="text-[#33C6FF] font-bold text-2xl">Predictor</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <div
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isActive(link.href) 
                      ? "text-white border-b-2 border-[#FF4D4D]" 
                      : "text-[#E0E0E0] hover:text-white"
                  }`}
                >
                  {link.name}
                </div>
              </Link>
            ))}
          </div>
          
          {/* Mobile nav */}
          <div className="flex md:hidden items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#1E2530] text-white border-gray-800">
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.name} href={link.href}>
                      <div
                        className={`py-2 text-lg font-medium transition-colors duration-200 cursor-pointer ${
                          isActive(link.href) 
                            ? "text-white border-l-4 border-[#FF4D4D] pl-4" 
                            : "text-[#E0E0E0] hover:text-white"
                        }`}
                        onClick={closeMenu}
                      >
                        {link.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
