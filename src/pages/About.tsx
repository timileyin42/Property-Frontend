import Navbar from "../components/Navbar";
import AboutUsMinimal from "../components/AboutUsMinimal";
import TestimonialsSimple from "../components/TestimonialsSimple";
import FAQ from "../components/FAQ";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar
        links={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: "Updates", href: "/updates" },
        ]}
      />

      <div className="pt-32 px-4 sm:px-8 max-w-7xl mx-auto">
        <span className="label-caps text-premium-gold mb-4 block">Our Story</span>
        <h2 className="font-display text-4xl sm:text-5xl text-on-surface mb-2">About Us</h2>
        <p className="text-on-surface-variant text-lg max-w-2xl">
          Learn more about our team and how we make fractional property investment seamless.
        </p>
      </div>

      <div className="space-y-12">
        <AboutUsMinimal />
        <section className="py-12">
          <TestimonialsSimple />
        </section>
        <FAQ />
      </div>
    </div>
  );
};

export default About;
