import { Step } from "@/lib/types";

interface HowItWorksSectionProps {
  steps: Step[];
}

export default function HowItWorksSection({ steps }: HowItWorksSectionProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 section-fade">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">How It Works</h2>
          <p className="mt-4 text-lg text-[#9CA3AF] max-w-2xl mx-auto">
            Our AI-powered system analyzes fighter data to predict outcomes with precision
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 section-fade">
          {steps.map((step, index) => (
            <div key={index} className="bg-[#1E2530] rounded-xl p-8 card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#33C6FF]/10 rounded-bl-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className={`w-16 h-16 ${step.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${step.iconColor}`} viewBox="0 0 20 20" fill="currentColor">
                    {step.icon === 'database' && (
                      <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                    )}
                    {step.icon === 'database' && (
                      <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                    )}
                    {step.icon === 'database' && (
                      <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                    )}
                    {step.icon === 'robot' && (
                      <>
                        <path fillRule="evenodd" d="M10.5 5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm0 10a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm7.5-7.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0 10a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM16.957 11.243l-2.114-2.114-1.414 1.414 2.114 2.114 1.414-1.414zm-10.5 0l-1.414 1.414 2.114 2.114 1.414-1.414-2.114-2.114zM8.957 5.243L7.543 3.829 5.429 5.943l1.414 1.414L8.957 5.243z" clipRule="evenodd" />
                      </>
                    )}
                    {step.icon === 'chart-line' && (
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2h14a1 1 0 100-2H3zm0 6a1 1 0 000 2h9a1 1 0 100-2H3zm0 6a1 1 0 100 2h5a1 1 0 100-2H3z" clipRule="evenodd" />
                    )}
                  </svg>
                </div>
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 rounded-full ${step.bgColor} flex items-center justify-center font-bold ${step.iconColor} mr-3`}>{step.number}</div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-[#E0E0E0]">{step.description}</p>
                
                {/* Step visualization image */}
                <img src={step.image} alt={step.title} className="mt-6 rounded-lg w-full h-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
