import Navbar from "../components/Navbar";
import AboutUsMinimal from "../components/AboutUsMinimal";
import TestimonialsSimple from "../components/TestimonialsSimple";
import FAQ from "../components/FAQ";

const About = () => {
  return (
    <div className="mx-auto px-4 my-16">
      <Navbar
        links={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: "Updates", href: "/updates" },
        ]}
      />

      <div className="pt-6 mb-8">
        <h2 className="font-bold text-blue-900 text-3xl">About Us</h2>
        <p className="text-gray-500 text-sm">
          Learn more about our team and how we make fractional property
          investment seamless.
        </p>
      </div>

      <div className="space-y-12">
        <AboutUsMinimal />
        <TestimonialsSimple />
        <FAQ />
      </div>
    </div>
  );
};

export default About;
