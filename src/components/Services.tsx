import { Truck, Car, Package } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Open Auto Transport",
    description:
      "Cost-effective solution for standard vehicles. Your car travels on an open carrier, exposed to weather but fully insured.",
  },
  {
    icon: Car,
    title: "Enclosed Auto Transport",
    description:
      "Premium protection for luxury, classic, or exotic vehicles. Fully enclosed carriers shield your car from elements.",
  },
  {
    icon: Package,
    title: "Door-to-Door Service",
    description:
      "Maximum convenience. We pick up from your location and deliver directly to your destination.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Transport Options</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the service that best fits your needs and budget
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-card p-8 rounded-lg border border-border hover:border-primary transition-colors group"
            >
              <div className="mb-4">
                <service.icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
