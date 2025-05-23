import { Feature } from "@/lib/types";

interface WhyUseThisSectionProps {
  features: Feature[];
}

export default function WhyUseThisSection({ features }: WhyUseThisSectionProps) {
  // Map feature icons to the appropriate icon component
  const getIcon = (iconName: string) => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {iconName === 'search-dollar' && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        )}
        {iconName === 'chart-pie' && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        )}
        {iconName === 'bolt' && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        )}
        {iconName === 'brain' && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        )}
        {iconName === 'history' && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        )}
        {iconName === 'mobile-alt' && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        )}
      </svg>
    );
  };

  // Define background and text colors for the features
  const colors = [
    { bg: "bg-[#33C6FF]/20", text: "text-[#33C6FF]" },
    { bg: "bg-[#FF4D4D]/20", text: "text-[#FF4D4D]" },
    { bg: "bg-[#4DFF91]/20", text: "text-[#4DFF91]" }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1E2530]/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 section-fade">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Why Use This?</h2>
          <p className="mt-4 text-lg text-[#9CA3AF] max-w-2xl mx-auto">
            Our platform offers unique advantages for both casual fans and serious bettors
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 section-fade">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#1E2530] p-6 rounded-xl card">
              <div className={`w-14 h-14 ${colors[index % 3].bg} rounded-xl flex items-center justify-center mb-6`}>
                <div className={colors[index % 3].text}>
                  {getIcon(feature.icon)}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-[#E0E0E0]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
