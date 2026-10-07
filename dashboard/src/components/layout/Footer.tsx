import {
  HeartHandshake,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import {
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";

const socialIcons = [
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
];

export default function Footer() {
  return (
    <footer className="border-t border-niamind-border bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* BRAND */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 font-extrabold text-lg tracking-tight text-niamind-navy">
              <div className="h-10 w-10 rounded-2xl bg-niamind-teal flex items-center justify-center shadow-sm">
                <HeartHandshake className="h-5 w-5 text-white" />
              </div>

              Niamind
            </div>

            <p className="text-sm text-niamind-muted mt-3 leading-relaxed max-w-sm">
              Support for everyone, by everyone. A social enterprise
              marketplace designed to make mental health access sustainable
              and sharable.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialIcons.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-10 w-10 rounded-xl border border-niamind-border bg-niamind-bg flex items-center justify-center hover:bg-white transition"
                >
                  <Icon className="h-4 w-4 text-niamind-muted" />
                </a>
              ))}
            </div>
          </div>

          {/* LINKS */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">

              <div>
                <h3 className="font-extrabold text-niamind-navy">
                  About Us
                </h3>

                <div className="mt-4 space-y-3 text-niamind-muted">
                  <p>Who we are</p>
                  <p>Partnerships</p>
                  <p>Blog</p>
                  <p>Contact</p>
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-niamind-navy">
                  Product
                </h3>

                <div className="mt-4 space-y-3 text-niamind-muted">
                  <p>Find Support</p>
                  <p>Professionals</p>
                  <p>Slot Economy</p>
                  <p>Trust</p>
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-niamind-navy">
                  Support
                </h3>

                <div className="mt-4 space-y-3 text-niamind-muted">
                  <p>Help Center</p>
                  <p>FAQs</p>
                  <p>Terms</p>
                  <p>Privacy</p>
                </div>
              </div>

            </div>
          </div>

          {/* CONTACT */}
          <div className="lg:col-span-2 text-sm text-niamind-muted">
            <h3 className="font-extrabold text-niamind-navy">
              Get in touch
            </h3>

            <div className="mt-4 space-y-4">

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-niamind-teal" />
                <span>hello@niamind.org</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-niamind-teal" />
                <span>+256 000 000 000</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-niamind-teal" />
                <span>Kampala, Uganda</span>
              </div>

            </div>

            <button className="mt-6 w-full px-3 py-3 rounded-xl bg-niamind-gold text-white font-bold hover:opacity-95 transition">
              Join waitlist
            </button>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 pt-6 border-t border-niamind-border text-xs text-niamind-muted flex flex-col md:flex-row gap-3 md:gap-0 justify-between">
          <p>
            © {new Date().getFullYear()} Niamind
          </p>

          <p className="hidden md:block max-w-md leading-relaxed">
            Niamind is not an emergency service. If you are in crisis,
            contact local emergency services.
          </p>
        </div>

      </div>
    </footer>
  );
}