import { useState, useEffect, useCallback } from "react";
// import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Star } from "lucide-react";

const TestimonialsSimple = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const testimonials = [
    {
      name: "Sarah Okonkwo",
      role: "Real Estate Investor",
      comment: "Elycap Luxury Homes has completely transformed how I invest in real estate. The transparency and real-time monitoring give me peace of mind.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b786d4c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "David Adeleke",
      role: "Tech Entrepreneur",
      comment: "As someone who values transparency, Elycap Luxury Homes is exactly what the real estate market needed. Highly recommended!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Amina Muhammed",
      role: "Business Consultant",
      comment: "Starting my real estate investment journey with fractional ownership was the best decision. The customer service is exceptional!",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  // const prevSlide = () => {
  //   setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  // };

  // Auto-play
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);

  //  useEffect(() => {
  //   if (isHovered) return;
    
  //   const interval = setInterval(() => {
  //     nextSlide();
  //   }, 4000);

  //   return () => clearInterval(interval);
  // }, [isHovered, nextSlide]);

  return (
    <section className="py-12 md:py-2 px-4 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        

        {/* Mobile Cards - Stacked */}
        <div className="md:hidden space-y-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 object-cover rounded-full flex-shrink-0"
                />
                <div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-blue-600 text-sm mb-3">{testimonial.role}</p>
                  <p className="text-gray-700 text-sm italic">"{testimonial.comment}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Carousel */}
        <div 
          className="hidden md:block relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
                    <div className="flex items-center gap-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-20 h-20 object-cover rounded-full flex-shrink-0"
                      />
                      <div>
                        <div className="flex gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">{testimonial.name}</h4>
                        <p className="text-blue-600 font-medium mb-4">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg italic mt-6">"{testimonial.comment}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          {/*<button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>*/}

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSimple;