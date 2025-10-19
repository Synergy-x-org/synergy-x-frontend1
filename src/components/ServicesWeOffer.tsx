import { Truck, MapPin, Building, Shield, Zap, Package } from "lucide-react";

import openTransportImage from "@/assets/placeholder-open-transport.png";
import doorToDoorImage from "@/assets/placeholder-door-to-door.png";
import corporateImage from "@/assets/placeholder-corporate.png";
import enclosedImage from "@/assets/placeholder-enclosed.png";
import expeditedImage from "@/assets/placeholder-expedited.png";
import expedited2Image from "@/assets/placeholder-expedited2.png";

const services = [
  {
    icon: Truck,
    title: "Open Auto Transport",
    description: "The most affordable option for standard cars, using open-air trailers to transport multiple vehicles.",
    image: openTransportImage,
  },
  {
    icon: MapPin,
    title: "Door-to-Door Auto Transport",
    description: "We pick up your vehicle at your home and deliver it directly to your new address.",
    image: doorToDoorImage,
  },
  {
    icon: Building,
    title: "Corporate & Fleet Transport",
    description: "Businesses trust us to handle their fleet, ensuring timely and secure deliveries for employees, clients.",
    image: corporateImage,
  },
  {
    icon: Shield,
    title: "Enclosed Auto Transport",
    description: "For added protection, we offer enclosed transport, ideal for high-end or classic cars.",
    image: enclosedImage,
  },
  {
    icon: Zap,
    title: "Expedited Shipping",
    description: "Need your car delivered faster? We offer expedited options to meet your time frame.",
    image: expeditedImage,
  },
  {
    icon: Zap,
    title: "Expedited Shipping",
    description: "Need your car delivered faster? We offer expedited options to meet your time frame.",
    image: expedited2Image,
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
              {/* Service Image */}
              <div className="h-64 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover" 
                />
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
