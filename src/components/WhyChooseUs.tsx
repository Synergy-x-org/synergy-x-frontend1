import { Shield, Users, MapPinned, DollarSign } from "lucide-react";

const features = [
  {
    icon: Users,
    number: "1",
    title: "Experienced Team",
    description:
      "Our expert drivers and customer service team ensure your vehicle is handled with care, every step of the way.",
  },
  {
    icon: MapPinned,
    number: "2",
    title: "Nationwide Coverage",
    description:
      "From coast to coast, we serve all 50 states, with reliable and timely delivery.",
  },
  {
    icon: Shield,
    number: "3",
    title: "Fully Insured",
    description:
      "Your vehicle is fully protected from pickup to delivery, with no added stress or hidden fees.",
  },
  {
    icon: DollarSign,
    number: "4",
    title: "Affordable Rates",
    description:
      "Get the best value without compromising on quality. Transparent pricing you can trust.",
  },
];

const WhyChooseUs = () => {
  return (
<section
  id="why-choose-us"
  className="scroll-mt-24 py-20 bg-background"
>      
<div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Synergy X</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We understand how much your car means to you. Whether you're relocating, buying a new
            vehicle, or need to ship your car for vacation, we offer top-notch auto transport
            services tailored to your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl font-bold text-primary">{feature.number}</div>
                <feature.icon className="h-8 w-8 text-primary mt-1" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
