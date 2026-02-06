import Navbar from "../components/Navbar";
import { Instagram } from "lucide-react";

const Contact = () => {
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
        <h2 className="font-bold text-blue-900 text-3xl">Contact Us</h2>
        <p className="text-gray-500 text-sm">
          Reach out to our team for inquiries, support, or partnerships.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-blue-900 font-semibold text-lg">Office</h3>
          <p className="text-sm text-gray-600">
            Elycapvest Luxury Homes<br />
            University Road Akoka Yaba,<br />
            Lagos, Nigeria
          </p>
          <div className="text-sm text-gray-600">
            <p>Phone: +234 8133101607</p>
            <p>Email: Elycapluxuryhomes@gmail.com</p>
          </div>
          <a
            href="https://www.instagram.com/elycap_luxuryhomes/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-900 hover:text-blue-700"
          >
            <Instagram className="h-4 w-4" />
            @elycap_luxuryhomes
          </a>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-blue-900 font-semibold text-lg">Support</h3>
          <p className="text-sm text-gray-600">
            Our support team is available Monday to Friday, 9am to 6pm.
          </p>
          <div className="text-sm text-gray-600">
            <p>Email: Elycapluxuryhomes@gmail.com</p>
            <p>Phone: +234 809 876 5432</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
