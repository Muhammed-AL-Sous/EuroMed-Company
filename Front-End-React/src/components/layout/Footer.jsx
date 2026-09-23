import { Building2, Mail, Phone, ShieldCheck } from "lucide-react";
import { Link as RouterLink } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center flex-col">
                <img
                  src="/images/EuroMed-Logo-layout.png"
                  alt="EuroMed-Logo"
                  className="w-50 mb-0 mx-auto"
                />
                <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
                  Orthopedic & Surgical Implants
                </span>
              </div>
            </div>
            <hr className="border-sky-900 border mx-28 ms-0.5" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              EuroMed is Iraq’s Leading Medical Supplies Provider Specializing
              in Premium Orthopedic Implants, Surgical Materials, and Total
              Joint Replacement Hardware Serving Surgeons and Hospitals.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs font-semibold text-sky-400">
              <span className="flex items-center gap-1 bg-sky-950/80 px-3 py-1.5 rounded-lg border border-sky-800/50">
                <ShieldCheck className="w-4 h-4 text-sky-400" /> ISO 13485
                Certified
              </span>
              <span className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                100% Implant Traceability
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>

            <ul className="space-y-6 text-sm">
              <li className="hover:text-white hover:translate-x-1 duration-300">
                <RouterLink to="/" className="hover:text-white">
                  Home
                </RouterLink>
              </li>
              <li className="hover:text-white hover:translate-x-1 duration-300">
                <RouterLink
                  to="/products"
                  className="hover:text-white"
                >
                  Orthopedic Products
                </RouterLink>
              </li>
              <li className="hover:text-white hover:translate-x-1 duration-300">
                <RouterLink
                  to="/brands"
                  className="hover:text-white"
                >
                  Partner Brands
                </RouterLink>
              </li>
              <li className="hover:text-white hover:translate-x-1 duration-300">
                <RouterLink
                  to="/about"
                  className="hover:text-white"
                >
                  About EuroMed
                </RouterLink>
              </li>
              <li className="hover:text-white hover:translate-x-1 duration-300">
                <RouterLink
                  to="/contact"
                  className="hover:text-white"
                >
                  Contact Us
                </RouterLink>
              </li>
            </ul>
          </div>

          {/* Patient Portal & Verification */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Patient Portal
            </h4>
            <ul className="space-y-8 text-sm">
              <li>
                <RouterLink
                  to="/operation-details"
                  className="text-sky-400 font-medium hover:text-sky-300 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" /> Operation Details
                </RouterLink>
              </li>
              <li className="text-xs text-slate-500 leading-7 pt-1">
                Patients Can Enter Their Operation Code and Operation Date To
                Verify Implant Materials Used During Surgery.
              </li>
              <li>
                <RouterLink
                  to="/login"
                  className="hover:text-white duration-300 transition-colors text-xs text-slate-400 pt-2 block"
                >
                  Doctor & Hospital Portal Login →
                </RouterLink>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Erbil Headquarters
            </h4>
            <ul className="space-y-8 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="flex flex-col space-y-4">
                  <span>Koya Road, Hewa City</span>
                  <span>Zone A, Building 142</span>
                  <span>Erbil, Iraq</span>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>+964 750 376 9545</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Euromed.iraq@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 tracking-wider gap-4">
          <p>
            © {new Date().getFullYear()} EuroMed Orthopedic & Surgical Supplies
            Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 duration-300 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-slate-400 duration-300 transition-colors cursor-pointer">
              Terms of Use
            </span>
            <span className="hover:text-slate-400 duration-300 transition-colors cursor-pointer">
              Medical Compliance
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
