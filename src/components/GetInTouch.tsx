import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Home, Phone, Mail } from "lucide-react";
import { contactAPI } from "@/services/api";

const GetInTouch = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // 🕒 Automatically clear the message after 30 seconds
  useEffect(() => {
    if (responseMessage) {
      const timer = setTimeout(() => {
        setResponseMessage("");
        setIsError(false);
      }, 30000); 

      return () => clearTimeout(timer);
    }
  }, [responseMessage]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.message.trim().length < 10) {
      setIsError(true);
      setResponseMessage("Message must be at least 10 characters long.");
      return;
    }

    try {
      const response = await contactAPI.getInTouch(formData);
      setIsError(false);
      setResponseMessage(
        response.message || "✅ Your message has been sent successfully!"
      );
      setFormData({ name: "", phoneNumber: "", email: "", message: "" });
    } catch (error: any) {
      setIsError(true);
      setResponseMessage(
        error.message || "❌ Something went wrong. Please try again."
      );
    }
  };

  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Side - Contact Info */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get In Touch With Us
            </h2>
            <p className="text-muted-foreground mb-12">
              At Synergy Auto Transport, our goal is to make the relocation of
              your vehicle as fast, safe, and cost-effective as possible.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Our Location</h3>
                  <p className="text-muted-foreground">
                    99 S.t Jomblo Park Pekanbaru 28292, Indonesia
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Phone Number</h3>
                  <p className="text-muted-foreground">(+62)81 414 257 9980</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Email Address</h3>
                  <p className="text-muted-foreground">info@yourdomain.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-card p-8 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-background"
              />
              <Input
                name="email"
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-background"
              />
              <Input
                name="phoneNumber"
                type="tel"
                placeholder="Your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="bg-background"
              />
              <Textarea
                name="message"
                placeholder="Your message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="bg-background resize-none"
              />

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90"
              >
                Send Message
              </Button>
            </form>

            {/* ✅ Response Message with color + timeout */}
            {responseMessage && (
              <p
                className={`mt-4 text-center font-semibold transition-opacity duration-500 ${
                  isError ? "text-red-600" : "text-green-600"
                }`}
              >
                {responseMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
