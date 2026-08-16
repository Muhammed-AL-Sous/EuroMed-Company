import { ArrowRight, Calendar, KeyRound, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

const PatientPortalCTA = () => {
  const [code, setCode] = useState("");
  const [date, setDate] = useState("");

  const [errors, setErrors] = useState({
    errorsCode: "",
    errorsDate: "",
  });

  const navigate = useNavigate();

  /* =========================
     Current Date
  ========================= */

  const dateNow = useMemo(() => {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    return `${day} / ${month} / ${year}`;
  }, []);

  /* =========================
     Validation
  ========================= */

  const patientDetailsValidation = () => {
    const trimmedCode = code.trim();
    const trimmedDate = date.trim();

    const newErrors = {
      errorsCode: "",
      errorsDate: "",
    };

    // Validate Operation Code
    if (!trimmedCode) {
      newErrors.errorsCode = "Please Enter Your Operation Code";
    }

    // Validate Operation Date
    if (!trimmedDate) {
      newErrors.errorsDate = "Please Enter Your Operation Date";
    }

    // Update errors once
    setErrors(newErrors);

    // Return true only if there are no errors
    return !newErrors.errorsCode && !newErrors.errorsDate;
  };

  /* =========================
     Submit
  ========================= */

  const handleQuickSubmit = (e) => {
    e.preventDefault();

    const isValid = patientDetailsValidation();

    if (!isValid) return;

    const trimmedCode = code.trim();
    const trimmedDate = date.trim();

    navigate(
      `/operation-details?code=${encodeURIComponent(
        trimmedCode,
      )}&date=${encodeURIComponent(trimmedDate)}`,
    );
  };

  /* =========================
     Code Change
  ========================= */

  const handleCodeChange = (e) => {
    const value = e.target.value;

    setCode(value);

    // Remove error when user starts correcting the field
    if (errors.errorsCode) {
      setErrors((prev) => ({
        ...prev,
        errorsCode: "",
      }));
    }
  };

  /* =========================
     Date Change
  ========================= */

  const handleDateChange = (e) => {
    const value = e.target.value;

    setDate(value);

    // Remove error when user selects a date
    if (errors.errorsDate) {
      setErrors((prev) => ({
        ...prev,
        errorsDate: "",
      }));
    }
  };

  return (
    <section className="py-16 bg-linear-to-br from-slate-900 via-slate-900 to-sky-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-sky-500/30 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* =========================
                Left Column
            ========================= */}
            <div className="lg:col-span-7 space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider border border-sky-400/30">
                <ShieldCheck className="w-4 h-4 text-sky-400" /> Patient
                Operation Portal
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Your Operation Details
              </h2>

              {/* Description */}
              <p className="text-slate-300 text-base leading-relaxed max-w-xl">
                Enter your unique operation code and surgery date to securely
                access the full list of medical materials, implant serial
                numbers, and manufacturer lot codes used in your procedure.
              </p>

              {/* Demo Information */}
              <div className="pt-2 text-xs text-sky-300/80 flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Sample Demo Code : <strong className="text-white">A0001</strong>{" "}
                | Date : <strong className="text-white">{dateNow}</strong>
              </div>
            </div>

            {/* =========================
                Right Column
            ========================= */}
            <div className="lg:col-span-5 bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-xl">
              <form onSubmit={handleQuickSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Operation Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="operation-code"
                      name="operationCode"
                      type="text"
                      value={code}
                      onChange={handleCodeChange}
                      placeholder="For Example: A0001"
                      autoComplete="off"
                      spellCheck={false}
                      aria-invalid={Boolean(errors.errorsCode)}
                      aria-describedby={
                        errors.errorsCode ? "operation-code-error" : undefined
                      }
                      placeholder="For Example : A0001"
                      className={`w-full bg-slate-800 text-white pl-11 pr-4 py-3 rounded-xl border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm font-mono tracking-wider uppercase font-bold ${
                        errors.errorsCode
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      }`}
                    />
                    {/* Error */}
                    <div className="pt-2">
                      {errors.errorsCode && (
                        <p
                          id="operation-code-error"
                          className="px-1 text-xs font-semibold text-red-500"
                        >
                          {errors.errorsCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Operation Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="operation-date"
                      name="operationDate"
                      type="date"
                      value={date}
                      onChange={handleDateChange}
                      aria-invalid={Boolean(errors.errorsDate)}
                      aria-describedby={
                        errors.errorsDate ? "operation-date-error" : undefined
                      }
                      className={`w-full bg-slate-800 text-white pl-11 pr-4 py-3 rounded-xl border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm font-mono font-medium ${
                        errors.errorsDate
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      }`}
                    />
                    {/* Error */}
                    <div className="pt-2">
                      {errors.errorsDate && (
                        <p
                          id="operation-date-error"
                          className="px-1 text-xs font-semibold text-red-500"
                        >
                          {errors.errorsDate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-base transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 group mt-2"
                >
                  View My Operation Details
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatientPortalCTA;
