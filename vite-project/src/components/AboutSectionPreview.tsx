import { Button } from "@/components/ui/button";

export default function AboutSectionPreview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1E2530]/30" id="about">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center section-fade">
          <div>
            {/* A close-up image of UFC fight analysis on a computer screen */}
            <img 
              src="https://images.unsplash.com/photo-1607706189992-eae578626c86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
              alt="UFC fight analysis on screen" 
              className="rounded-2xl shadow-2xl w-full h-auto" 
            />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">About the Project</h2>
            <p className="text-[#E0E0E0] text-lg mb-6">
              UFCPredictor started as a passion project combining deep learning and combat sports analytics. 
              What began as a personal challenge to apply machine learning in a real-world setting has evolved into a fully self-taught journey of experimentation and growth.
            </p>
            <p className="text-[#E0E0E0] text-lg mb-8">
              I'm continuously improving the models with each event, learning from both successes and misses to provide the most accurate predictions possible. Every line of code and every prediction reflects countless hours of self-driven learning and a deep love for the sport.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
