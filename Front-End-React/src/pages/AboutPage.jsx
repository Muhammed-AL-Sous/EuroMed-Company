import { Award, Building2, ShieldCheck, Stethoscope } from "lucide-react";
import LocationMap from "./../components/common/LocationMap";

const AboutPage = () => {
  const values = [
    {
      title: "Uncompromised Quality",
      description:
        "We Source Exclusively From ISO 13485 Certified European and International Implant Manufacturers.",
      icon: Award,
    },
    {
      title: "100% Implant Traceability",
      description:
        "Every Product Carries Complete Lot and Serial Number Records For Maximum Patient Safety and Clinical Audits.",
      icon: ShieldCheck,
    },
    {
      title: "Expert Surgical Support",
      description:
        "Our Technical Specialists Support Surgical Teams During Complex Total Joint Arthroplasty Procedures.",
      icon: Stethoscope,
    },
    {
      title: "Local Erbil Inventory",
      description:
        "Our Erbil Warehouse Maintains Immediate Stock To Prevent Surgical Delays in Emergency Trauma Cases.",
      icon: Building2,
    },
  ];

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen space-y-12">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="mx-auto text-center max-w-5xl space-y-4">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-sky-400 bg-sky-500/20 px-3.5 py-1.5 rounded-full border border-sky-400/30">
              About EuroMed
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Pioneering Orthopedic Healthcare in Iraq
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed tracking-wide">
              EuroMed is An Established Medical Supplies Provider Based In
              Erbil, Iraq. We Specialize In Orthopedic and Surgical Materials,
              Total Joint Replacement Systems, Trauma Hardware, and Specialized
              Surgical Equipment.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Why Hospitals & Surgeons Choose EuroMed
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Delivering Precision, Reliability, and Continuous Surgical Support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:shadow-xl hover:border-sky-300 hover:-translate-y-1 duration-300 transition-all "
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 duration-400 transition-colors">
                  {v.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {v.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Headquarters Location */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            EuroMed Headquarters & Distribution Hub
          </h2>
          <p className="text-slate-600 text-sm">
            Located on Koya Road, Hewa City, Zone A, Building 142, Erbil, Iraq.
          </p>
        </div>
        <LocationMap />
      </div>
    </div>
  );
};

export default AboutPage;
