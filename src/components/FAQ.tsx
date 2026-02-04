import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "What is fractional real estate investment?",
      answer: "Fractional real estate investment allows you to own a portion (fraction) of a property rather than the entire property. This makes premium real estate investment accessible with lower capital requirements while still earning proportional returns."
    },
    {
      id: 2,
      question: "How do I earn returns on my investment?",
      answer: "You earn returns through monthly rental income from shortlet bookings and potential capital appreciation. Returns are distributed proportionally based on your fraction ownership percentage."
    },
    {
      id: 3,
      question: "What is the minimum investment amount?",
      answer: "The minimum investment varies by property, but you can start with as low as one fraction. Pricing is defined per property and may change—please check back later for current rates."
    },
    {
      id: 4,
      question: "How transparent is the platform?",
      answer: "We provide complete transparency with real-time monitoring of bookings, occupancy rates, revenue, and expenses. You can track your property performance 24/7 through your investor dashboard."
    },
    {
      id: 5,
      question: "Can I sell my property fractions?",
      answer: "Yes, you can list your fractions for sale on our secondary marketplace. Other investors can purchase your fractions, providing liquidity to your investment."
    },
    {
      id: 6,
      question: "Are the properties verified?",
      answer: "Absolutely. All properties listed on Elycapvest Luxury Homes undergo thorough verification including legal documentation checks, property inspections, and market valuation assessments."
    },
    {
      id: 7,
      question: "How does partnership work?",
      answer: "We’re finalizing our partnership model and onboarding details. Please check back later for the full process and requirements."
    }
  ];

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-12 md:py-24 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>FAQs</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-blue-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about Elycapvest Luxury Homes
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl shadow-sm  transition-all duration-300 ${
                openId === item.id ? 'shadow-lg border-blue-200' : 'hover:shadow-md'
              }`}
            >
              <button
                onClick={() => toggleAccordion(item.id)}
                className="w-full px-6 py-4 md:px-8 md:py-6 flex items-center justify-between gap-4 text-left  rounded-xl"
                aria-expanded={openId === item.id}
              >
                <div className="flex items-start gap-4">
                  
                  <h3 className="text-lg md:text-xl font-semibold text-blue-900 pr-4">
                    {item.question}
                  </h3>
                </div>
                <ChevronDown 
                  className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 text-gray-500 transition-transform duration-300 ${
                    openId === item.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {/* Answer with animation */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  openId === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 md:px-14 md:pb-8 pt-0">
                  <div className="border-l-4 border-blue-200 pl-4">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                  
                  {/* Additional info based on question */}
                  {item.id === 3 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <span className="font-medium">Pricing updates:</span>
                        <span>Check back later</span>
                      </div>
                    </div>
                  )}
                  
                  {item.id === 4 && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
                      <span>✅ Real-time dashboard</span>
                      <span>✅ Transparent reporting</span>
                      <span>✅ 24/7 access</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

       
      </div>
    </section>
  );
};

export default FAQ;
