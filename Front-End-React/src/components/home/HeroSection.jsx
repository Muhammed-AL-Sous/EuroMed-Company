import {
  ArrowRight,
  Award,
  CheckCircle2,
  Shield,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background medical glow gradient */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-150 h-150 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-125 h-125 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Premium
                Orthopedic Implants & Surgical Materials
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Advanced Orthopedic <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 via-teal-300 to-sky-200">
                  Solutions in Erbil
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                EuroMed supplies high-quality, internationally certified
                orthopedic and surgical medical materials for doctors,
                hospitals, and healthcare professionals across Iraq. Precision
                engineered for arthroplasty, trauma, and joint reconstruction.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-base transition-all shadow-lg shadow-sky-500/25 group"
                >
                  Explore Products
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/operation-details"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-base border border-slate-700 transition-all"
                >
                  <Shield className="w-5 h-5 text-sky-400" />
                  Patient Operation Portal
                </Link>
              </div>

              {/* Trust Highlights */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Verified Lot Traceability</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Erbil HQ & Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Trusted Global Brands</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-800/90 shadow-2xl p-3">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
                  alt="EuroMed Orthopedic Surgical Implants"
                  className="w-full h-95 object-cover rounded-2xl brightness-95"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Overlay Card 1 */}
                <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-sky-500/30 shadow-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs text-sky-400 font-bold uppercase tracking-wider">
                      Featured Specialty
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      Total Knee & Hip Arthroplasty
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Maxx, Zimmer, Normmed Systems
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-sky-500/20 text-sky-300 font-bold text-xs">
                    ISO 13485
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
