// Icons
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";

// Components
import LocationMap from "./../components/common/LocationMap";

// Contacts Logic
import useContactPageLogic from "./useContactPageLogic";

import { motion } from "motion/react";
const ContactPage = () => {
  const {
    form,
    submitted,
    errorMessage,
    isSending,
    handleChange,
    handleSubmit,
  } = useContactPageLogic();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="py-12 sm:py-16 bg-slate-50 min-h-screen space-y-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="mx-auto text-center max-w-5xl space-y-4">
              <span className="inline-block text-[10px] sm:text-xs font-bold tracking-widest uppercase text-sky-400 bg-sky-500/20 px-3.5 py-1.5 rounded-full border border-sky-400/30">
                Contact EuroMed
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                Get in Touch With Our Erbil Office
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed tracking-wide">
                Whether You Are An Orthopedic Surgeon, Hospital Purchasing
                Manager, Or Patient Seeking Operation Verification Assistance,
                Our Erbil Team is Ready To Assist You.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Contact Details */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-700">
                Headquarters Information
              </h3>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-[15px]">
                      Physical Address
                    </div>
                    <div className="text-sky-700 text-[11px] tracking-tight leading-relaxed font-bold">
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
                    <div className="font-bold text-slate-800 text-[15px]">
                      Direct Phone Lines
                    </div>
                    <div className="text-sky-700 text-[11px] tracking-tight leading-relaxed font-bold">
                      +964 750 376 9545
                    </div>
                    <div className="text-sky-700 text-[11px] tracking-tight leading-relaxed font-bold">
                      +964 750 000 0000
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-[15px]">
                      Email Address
                    </div>
                    <div className="text-sky-700 text-[11px] tracking-tight leading-relaxed font-bold">
                      info@euromed.iq
                    </div>
                    <div className="text-sky-700 text-[11px] tracking-tight leading-relaxed font-bold">
                      Euromed.iraq@gmail.com
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-[15px]">
                      Operating Hours
                    </div>
                    <div className="text-sky-700 text-[11px] tracking-tight leading-relaxed font-bold">
                      Saturday – Thursday: 09:00 AM – 04:00 PM
                    </div>
                    <div className="text-sky-700 text-[11px] tracking-tight leading-relaxed font-bold">
                      Friday: Emergency Surgical Dispatch Only
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-lg sm:text-xl font-bold text-slate-700 mb-6">
                Send Us a Direct Message
              </h3>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold space-y-2">
                  <div className="text-base font-bold">
                    Thank You For Contacting EuroMed !
                  </div>
                  <div>
                    Your message has been received successfully. Our team will
                    review your request and get back to you as soon as possible.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-sm font-semibold text-slate-700 mb-1"
                      >
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Dr. Karwan Erfani"
                        maxLength={100}
                        required
                        disabled={isSending}
                        className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-sm font-semibold text-slate-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+964 750 000 0000"
                        maxLength={30}
                        required
                        disabled={isSending}
                        className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-semibold text-slate-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="doctor@hospital.iq"
                      maxLength={254}
                      required
                      disabled={isSending}
                      className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-sm font-semibold text-slate-700 mb-1"
                    >
                      Subject / Inquiry Type
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      disabled={isSending}
                      required
                      className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-medium"
                    >
                      <option value="Product Inquiry / Hospital Supply">
                        Product Inquiry / Hospital Supply
                      </option>
                      <option value="Patient Operation Verification Assistance">
                        Patient Operation Verification Assistance
                      </option>
                      <option value="Distribution & Brand Partnership">
                        Distribution & Brand Partnership
                      </option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-semibold text-slate-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      minLength={10}
                      maxLength={5000}
                      placeholder="Provide Details About Your Surgical Material or Hospital Needs ..."
                      required
                      disabled={isSending}
                      className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  {errorMessage && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3.5 rounded-xl cursor-pointer bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-sky-400" />
                    {isSending ? "Sending Message..." : "Send Message"}
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
    </motion.div>
  );
};

export default ContactPage;
