const ShippingCoverageMap = () => {
  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Car shipping coverage map
          </h2>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Map Container */}
          <div className="relative w-full h-[500px] bg-card rounded-lg overflow-hidden shadow-lg">
            {/* Placeholder for map - Replace with actual map integration */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(/melbourne-coverage-map.png)', // Replace with actual map image
              }}
            >
            </div>

            {/* Optional: Add interactive map integration here */}
            {/* You can integrate Google Maps, Mapbox, or other mapping services */}
          </div>

          {/* Coverage Information */}
          {/* <div className="mt-8 text-center">
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our extensive network covers the entire United States, ensuring your vehicle 
              can be picked up and delivered anywhere in the country with reliable service 
              and competitive rates.
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default ShippingCoverageMap;
