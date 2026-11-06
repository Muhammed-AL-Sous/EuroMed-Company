import { Activity } from "lucide-react";

const SiteLoader = ({ fullScreen = false, message = "Loading EuroMed..." }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={`
        flex items-center justify-center
        bg-slate-50 px-4
        ${
          fullScreen
            ? "fixed inset-0 z-9999 min-h-dvh"
            : "w-full min-h-75"
        }
      `}
    >
      <div className="flex flex-col items-center gap-5 text-center">
        {/* Animated Logo */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div
            className="
              absolute inset-0 rounded-full
              border-[3px] border-slate-200
              border-t-sky-600 border-r-sky-500
              animate-spin motion-reduce:animate-none
            "
          />

          <div
            className="
              flex h-18 w-18 items-center justify-center
              rounded-full bg-white
              shadow-lg shadow-sky-100
            "
          >
            <Activity className="h-10 w-10 text-sky-600" strokeWidth={2} />
          </div>
        </div>

        {/* Brand */}
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            EURO<span className="text-sky-600">MED</span>
          </h2>

          <p className="text-xs font-medium tracking-widest text-slate-500">
            Medical & Orthopedic Solutions
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex items-center gap-2" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="
                h-2 w-2 rounded-full bg-sky-500
                animate-bounce motion-reduce:animate-none
              "
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            />
          ))}
        </div>

        <p className="text-xs font-medium text-slate-400">{message}</p>
      </div>
    </div>
  );
};

export default SiteLoader;
