import { Calculator } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Pickup and Delivery Locations",
    description: "The starting point and destination (ZIP codes, city, or address).",
  },
  {
    number: "02",
    title: "Vehicle Type",
    description: "Type of vehicle being transported (e.g., sedan, truck, motorcycle, SUV, luxury car, etc.).",
  },
  {
    number: "03",
    title: "Year",
    description: "Whether the customer prefers open transport (lower cost, exposed) or enclosed transport (higher cost, extra protection).",
  },
  {
    number: "04",
    title: "Model",
    description: "The starting point and destination (ZIP codes, city, or address).",
  },
  {
    number: "05",
    title: "Maker",
    description: "The starting point and destination (ZIP codes, city, or address).",
  },
  {
    number: "06",
    title: "Shipment Date",
    description: "The starting point and destination (ZIP codes, city, or address).",
  },
];

const HowCalculatorWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How the cost calculator works?
          </h2>
          <p className="text-lg text-muted-foreground">
            Simple, Hassle-Free Process
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Calculator Illustration */}
          <div className="flex justify-center">
            <div className="relative w-80 h-96 bg-gradient-to-br from-primary/20 to-primary/40 rounded-3xl p-8 flex items-center justify-center shadow-lg">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 w-full h-full flex flex-col">
                {/* Calculator Display */}
                <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-lg h-16 mb-6"></div>
                
                {/* Calculator Buttons */}
                <div className="grid grid-cols-4 gap-3 flex-1">
                  <button className="bg-gray-700 rounded-lg text-white font-bold hover:bg-gray-600">MC</button>
                  <button className="bg-gray-700 rounded-lg text-white font-bold hover:bg-gray-600">M+</button>
                  <button className="bg-gray-700 rounded-lg text-white font-bold hover:bg-gray-600">+</button>
                  <button className="bg-gray-700 rounded-lg text-white font-bold hover:bg-gray-600">X</button>
                  
                  <button className="bg-gray-700 rounded-lg text-white text-2xl font-bold hover:bg-gray-600">7</button>
                  <button className="bg-gray-700 rounded-lg text-white text-2xl font-bold hover:bg-gray-600">8</button>
                  <button className="bg-gray-700 rounded-lg text-white text-2xl font-bold hover:bg-gray-600">9</button>
                  <button className="bg-gray-700 rounded-lg text-white font-bold hover:bg-gray-600">-</button>
                  
                  <button className="bg-gray-700 rounded-lg text-white text-2xl font-bold hover:bg-gray-600">4</button>
                  <button className="bg-gray-700 rounded-lg text-white text-2xl font-bold hover:bg-gray-600">5</button>
                  <button className="bg-gray-700 rounded-lg text-white text-2xl font-bold hover:bg-gray-600">6</button>
                  <button className="bg-gray-700 rounded-lg text-white font-bold hover:bg-gray-600">+</button>
                  
                  <button className="bg-gray-700 rounded-lg text-white text-2xl font-bold hover:bg-gray-600">1</button>
                  <button className="bg-gray-700 rounded-lg text-white text-2xl font-bold hover:bg-gray-600">2</button>
                  <button className="bg-gray-700 rounded-lg text-white text-2xl font-bold hover:bg-gray-600">3</button>
                  <button className="bg-primary rounded-lg text-white font-bold text-xl hover:bg-primary/90">=</button>
                  
                  <button className="bg-gray-700 rounded-lg text-white text-2xl font-bold hover:bg-gray-600 col-span-2">0</button>
                  <button className="bg-gray-700 rounded-lg text-white font-bold hover:bg-gray-600">.</button>
                </div>
              </div>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">{step.number}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowCalculatorWorks;
