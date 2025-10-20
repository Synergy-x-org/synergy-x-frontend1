import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GetInTouch from "@/components/GetInTouch";
import Testimonials from "@/components/Testimonials";

// New File: src/pages/Contact.tsx - Dedicated contact page

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Add top spacing to account for fixed header */}
      <main className="pt-[104px]">
        {/* Contact Intro Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contact us
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                For 9+ years, our team of experienced car transport coordinators has served thousands of car shipping customers like you.
              </p>
              <p className="text-muted-foreground">
                You can reach us anytime by phone or email for help with in-progress auto transportation orders. We are also here around the clock to provide personalized car shipping quotes and book shipments tailored to your schedule.
              </p>
              <p className="text-muted-foreground mt-4">
                Thank you for choosing Synergy X Auto Transport for your vehicle transportation needs. We are grateful for the opportunity to assist you.
              </p>
            </div>
          </div>
        </section>

        {/* Get In Touch Section */}
        <GetInTouch />
        <Testimonials />
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
