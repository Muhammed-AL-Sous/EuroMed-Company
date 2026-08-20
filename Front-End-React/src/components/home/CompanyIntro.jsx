import { Building2, Check, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

const CompanyIntro = () => {
  const stats = [
    {
      label: "Product Categories",
      value: "9+",
      description: "Knee, Hip, Plates, Screws, Nails & Cables",
    },
    {
      label: "Partner Brands",
      value: "6+",
      description: "Global manufacturers (Zimmer, MAXX, etc.)",
    },
    {
      label: "Orthopedic Surgeons",
      value: "350+",
      description: "Surgeons served across Erbil & Iraq",
    },
    {
      label: "Partner Hospitals",
      value: "45+",
      description: "Hospitals & surgical centers supplied",
    },
    {
      label: "Years Experience",
      value: "15+",
      description: "Dedicated orthopedic excellence",
    },
  ];

  const highlights = [
    "Uncompromising Medical Quality & ISO Certification",
    "Full Serial & Lot Number Traceability for Every Implant",
    "Comprehensive Inventory Stored in Erbil HQ",
    "Expert Surgical Support & Product Training",
    "Rapid Emergency Delivery to Operating Rooms",
    "Direct Partnerships with European & Global Manufacturers",
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800"
                  alt="Orthopedic Surgeons in Surgery"
                  className="w-full h-110 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-slate-100 text-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-sky-600 text-white font-bold">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">
                        EuroMed HQ Erbil
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Koya Road, Hiwa City, Zone A, Building 142
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider border border-sky-100">
                <ShieldCheck className="w-4 h-4 text-sky-600" /> About EuroMed
                Medical Supplies
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Empowering Orthopedic Excellence Across Hospitals in Iraq
              </h2>

              <p className="text-slate-600 leading-relaxed text-base">
                Based in <strong>Erbil, Iraq</strong>, EuroMed specializes in
                supplying premium orthopedic implants, surgical instrumentation,
                and trauma fixation products. We bridge the gap between
                world-leading medical manufacturers and local surgical teams,
                ensuring patients receive state-of-the-art implants backed by
                complete lot-level traceability.
              </p>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-3" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Grid */}

          <div className="mt-16 pt-12 border-t border-slate-100 grid grid-cols-2 lg:grid-cols-5 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: idx * 0.1 }}
              >
                <div
                  key={idx}
                  className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:border-sky-200 transition-colors"
                >
                  <div className="text-3xl sm:text-4xl font-black text-sky-600 font-mono mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CompanyIntro;
