import Navbar from "../components/Navbar";
import { Instagram } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar
        links={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: "Updates", href: "/updates" },
        ]}
      />

      <main className="pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="label-caps text-premium-gold mb-4 block">Get in Touch</span>
          <h2 className="font-display text-4xl sm:text-5xl text-on-surface mb-2">Contact Us</h2>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            Reach out to our team for inquiries, support, or partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel glass-panel-hover rounded-xl p-8 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-premium-gold">apartment</span>
              <h3 className="font-display text-2xl text-on-surface">Office</h3>
            </div>
            <p className="text-on-surface-variant">
              Elycapvest Luxury Homes<br />
              University Road Akoka Yaba,<br />
              Lagos, Nigeria
            </p>
            <div className="text-on-surface-variant space-y-1">
              <p>Phone: +234 8133101607</p>
              <p>Email: Elycapluxuryhomes@gmail.com</p>
            </div>
            <a
              href="https://www.instagram.com/elycap_luxuryhomes/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-premium-gold hover:underline"
            >
              <Instagram className="h-4 w-4" />
              @elycap_luxuryhomes
            </a>
          </div>

          <div className="glass-panel glass-panel-hover rounded-xl p-8 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-premium-gold">support_agent</span>
              <h3 className="font-display text-2xl text-on-surface">Support</h3>
            </div>
            <p className="text-on-surface-variant">
              Our support team is available Monday to Friday, 9am to 6pm.
            </p>
            <div className="text-on-surface-variant space-y-1">
              <p>Email: Elycapluxuryhomes@gmail.com</p>
              <p>Phone: +234 809 876 5432</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
