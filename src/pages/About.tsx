import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <div className="prose max-w-none">
          <p className="text-lg text-muted-foreground">
            Vetrix Auto 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
