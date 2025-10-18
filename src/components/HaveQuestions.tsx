import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I know my car is safe during transport?",
    answer:
      "Your vehicle is fully insured during transit. Our professional drivers are trained to handle vehicles with care, and we provide regular updates throughout the shipping process. You can track your vehicle's location in real-time.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery time depends on the distance and route. Typically, coast-to-coast transport takes 7-10 days, while shorter distances may take 3-5 days. We provide estimated delivery windows when you book your shipment.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept various payment methods including credit cards, debit cards, bank transfers, and certified checks. A deposit is required to secure your booking, with the remaining balance due upon delivery.",
  },
  {
    question: "How much does your service cost?",
    answer:
      "The cost varies based on distance, vehicle type, transport method (open or enclosed), and timing. Use our instant quote calculator to get an accurate estimate. We offer competitive rates with no hidden fees.",
  },
];

const HaveQuestions = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Map Background */}
      <div 
        className="absolute top-0 left-0 right-0 h-64 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/placeholder-map.jpg)', // Replace with actual map image
          filter: 'brightness(0.9)',
        }}
      >
        {/* Placeholder gradient when no map image */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-blue-50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Have Questions? We've Got Answers!
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default HaveQuestions;
