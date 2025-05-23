import { Testimonial } from "@/lib/types";

interface TestimonialSectionProps {
  testimonial: Testimonial;
}

export default function TestimonialSection({ testimonial }: TestimonialSectionProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto section-fade">
        <div className="bg-[#1E2530] rounded-2xl p-8 md:p-12 shadow-xl relative">
          <div className="absolute -top-5 -left-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#FF4D4D]/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          
          <div className="text-center">
            <p className="text-xl md:text-2xl text-white font-medium italic leading-relaxed mb-8">
              "{testimonial.quote}"
            </p>
            
            <div className="flex items-center justify-center mb-4">
              <div className="text-[#FF4D4D]">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            <div>
              <p className="font-semibold text-white">{testimonial.name}</p>
              <p className="text-sm text-[#9CA3AF]">{testimonial.role}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
