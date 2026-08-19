import { Building2, Compass, MapPin, Navigation, Phone } from "lucide-react";

const LocationMap = () => {
  return (
    <div className="bg-slate-900 text-white rounded-2xl overflow-hidden shadow-xl border border-slate-800">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Location Info Sidebar */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-slate-900">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold tracking-wide uppercase mb-4 border border-sky-500/20">
              <MapPin className="w-3.5 h-3.5" /> Headquarters Location
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Erbil Headquarters
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              EuroMed is strategically located in Erbil, Kurdistan Region, Iraq,
              serving healthcare facilities, orthopedic centers, and specialized
              hospitals across the region.
            </p>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-sky-400 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-white">Address</div>
                  <div className="text-slate-400">
                    Koya Road, Hiwa City
                    <br />
                    Zone A, Building 142
                    <br />
                    Erbil, Iraq
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-sky-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-white">
                    Direct Line & Hotline
                  </div>
                  <div className="text-slate-400">+964 750 376 9545</div>
                  <div className="text-slate-400">+964 750 000 0000</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-sky-400 shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-white">Coordinates</div>
                  <div className="text-slate-400 text-xs font-mono">
                    36°12'11.7"N 44°05'30.7"E
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
            <a
              href="https://maps.app.goo.gl/doDQseyRG19zvPsn9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-colors shadow-md"
            >
              <Navigation className="w-4 h-4" /> Open in Google Maps
            </a>
            <span className="text-xs text-slate-400">Erbil Branch</span>
          </div>
        </div>

        {/* Visual Simulated Map Stage */}
        <div className="lg:col-span-7 relative min-h-80 bg-slate-800 flex items-center justify-center p-6 overflow-hidden">
          {/* Map background grid pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#38bdf8 1px, #0f172a 1px)`,
              backgroundSize: "24px 24px",
              backgroundPosition: "0 0, 12px 12px",
            }}
          />

          {/* Road vector overlay graphics */}
          <svg
            className="absolute inset-0 w-full h-full opacity-30 text-sky-400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-50,200 Q200,100 400,250 T800,200"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
            />
            <path
              d="M150,-50 Q220,150 200,450"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray="4,4"
            />
            <circle
              cx="280"
              cy="180"
              r="140"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
          </svg>

          {/* Interactive Location Badge */}
          <div className="relative z-10 text-center bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-sky-500/30 shadow-2xl max-w-sm">
            <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 mx-auto mb-3 flex items-center justify-center border border-sky-400/40 animate-pulse">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">
              EuroMed Medical Supplies
            </h4>
            <p className="text-xs text-slate-300 font-medium mb-3">
              Hiwa City, Zone A, Building 142
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />{" "}
              Main Distribution Center Open
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
