import { Truck, MapPin, Building, Shield, Zap, Package } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Open Auto Transport",
    description: "The most affordable option for standard cars, using open-air trailers to transport multiple vehicles.",
    image: "/placeholder-open-transport.jpg", // Replace with actual image
  },
  {
    icon: MapPin,
    title: "Door-to-Door Auto Transport",
    description: "We pick up your vehicle at your home and deliver it directly to your new address.",
    image: "/placeholder-door-to-door.jpg", // Replace with actual image
  },
  {
    icon: Building,
    title: "Corporate & Fleet Transport",
    description: "Businesses trust us to handle their fleet, ensuring timely and secure deliveries for employees, clients.",
    image: "/placeholder-corporate.jpg", // Replace with actual image
  },
  {
    icon: Shield,
    title: "Enclosed Auto Transport",
    description: "For added protection, we offer enclosed transport, ideal for high-end or classic cars.",
    image: "/placeholder-enclosed.jpg", // Replace with actual image
  },
  {
    icon: Zap,
    title: "Expedited Shipping",
    description: "Need your car delivered faster? We offer expedited options to meet your time frame.",
    image: "/placeholder-expedited.jpg", // Replace with actual image
  },
  {
    icon: Zap,
    title: "Expedited Shipping",
    description: "Need your car delivered faster? We offer expedited options to meet your time frame.",
    image: "/placeholder-expedited2.jpg", // Replace with actual image
  },
];

const ServicesWeOffer = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Services We Offer</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Service Image Placeholder */}
              <div className="h-64 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <service.icon className="h-24 w-24 text-primary/40" />
                {/* Replace this placeholder with actual images */}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesWeOffer;
