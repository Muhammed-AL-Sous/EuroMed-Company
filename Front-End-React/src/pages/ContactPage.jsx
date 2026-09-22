import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import LocationMap from "./../components/common/LocationMap";

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="mx-auto text-center max-w-5xl space-y-4">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-sky-400 bg-sky-500/20 px-3.5 py-1.5 rounded-full border border-sky-400/30">
              Contact EuroMed
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Get in Touch With Our Erbil Office
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed tracking-wide">
              Whether You Are An Orthopedic Surgeon, Hospital Purchasing
              Manager, Or Patient Seeking Operation Verification Assistance, Our
              Erbil Team is Ready To Assist You.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-xl font-bold text-slate-900">
              Headquarters Information
            </h3>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-[14px]">
                    Physical Address
                  </div>
                  <div className="text-slate-600 text-[11.5px] font-semibold">
                    Koya Road, Hewa City
                    <br />
                    Zone A, Building 142
                    <br />
                    Erbil, Iraq
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-[14px]">
                    Direct Phone Lines
                  </div>
                  <div className="text-slate-600 text-[11.5px] font-semibold">
                    +964 750 376 9545
                  </div>
                  <div className="text-slate-600 text-[11.5px] font-semibold">
                    +964 750 000 0000
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-[14px]">
                    Email Address
                  </div>
                  <div className="text-slate-600 text-[11.5px] font-semibold">
                    info@euromed.iq
                  </div>
                  <div className="text-slate-600 text-[11.5px] font-semibold">
                    Euromed.iraq@gmail.com
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-[14px]">
                    Operating Hours
                  </div>
                  <div className="text-slate-600 text-[11.5px] font-semibold">
                    Saturday – Thursday: 09:00 AM – 04:00 PM
                  </div>
                  <div className="text-slate-600 text-[11.5px] font-semibold">
                    Friday: Emergency Surgical Dispatch Only
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Send Us a Direct Message
            </h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold space-y-2">
                <div className="text-base font-bold">
                  Thank You For Contacting EuroMed !
                </div>
                <div>
                  Your Inquiry Has Been Received. Our Medical Sales Specialist
                  in Erbil Will Contact You Shortly.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Dr. Karwan Erfani"
                      className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+964 750 000 0000"
                      className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="doctor@hospital.iq"
                    className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Subject / Inquiry Type
                  </label>
                  <select className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-medium">
                    <option>Product Inquiry / Hospital Supply</option>
                    <option>Patient Operation Verification Assistance</option>
                    <option>Distribution & Brand Partnership</option>
                    <option>General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide Details About Your Surgical Material or Hospital Needs ..."
                    className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm duration-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-sky-400" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LocationMap />
      </div>
    </div>
  );
};

export default ContactPage;
