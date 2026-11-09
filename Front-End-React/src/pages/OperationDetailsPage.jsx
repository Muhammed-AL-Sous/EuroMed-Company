import { motion } from "motion/react";
import {
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  Hash,
  KeyRound,
  Layers3,
  LoaderCircle,
  MapPin,
  Package,
  Phone,
  Printer,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import useOperationDetailsPageLogic from "./useOperationDetailsPageLogic.js";

// ---------------------------------------------------------
// Constants and formatting helpers
// ---------------------------------------------------------
const EMPTY_ITEMS = [];

const INPUT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 " +
  "text-sm text-slate-800 outline-none transition-colors " +
  "placeholder:text-slate-400 focus:border-sky-500 focus:bg-white " +
  "focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60";

const formatDate = (value) => {
  if (!value) return "—";
  // Read the date part without shifting days across time zones.
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : "—";
};

const getName = (value) => {
  if (typeof value === "string" && value.trim()) return value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return (
      value.en ||
      value.ar ||
      Object.values(value).find(
        (entry) => typeof entry === "string" && entry.trim(),
      ) ||
      "—"
    );
  }
  return "—";
};

const showValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.map(showValue).join(", ");
  if (typeof value === "object") {
    if ("en" in value || "ar" in value) return getName(value);
    return Object.entries(value)
      .map(([key, entry]) => `${key}: ${showValue(entry)}`)
      .join(", ");
  }
  return String(value);
};

// ---------------------------------------------------------
// Reusable presentation components
// ---------------------------------------------------------
const DetailsCard = ({ children, className = "" }) => (
  <section
    className={`
      report-card
      rounded-xl border border-slate-200
      bg-white p-5 shadow-sm sm:p-6
      print:break-inside-auto
      print:rounded-md
      print:p-3
      print:shadow-none
      ${className}
    `}
  >
    {children}
  </section>
);

const SectionHeader = ({ icon: Icon, title, subtitle, right }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
        <Icon size={20} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
    {right}
  </div>
);

const InfoField = ({ icon: Icon, label, value, mono = false }) => (
  <div className="min-w-0 space-y-1.5">
    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
      {Icon && <Icon size={15} aria-hidden="true" className="shrink-0" />}
      <span>{label}</span>
    </div>
    <p
      className={`wrap-break-word text-sm font-semibold text-slate-800 ${mono ? "font-mono" : ""}`}
    >
      {showValue(value)}
    </p>
  </div>
);

const Notes = ({ label, children, tone = "neutral" }) => (
  <div
    className={`mt-5 rounded-lg border p-4 ${
      tone === "info"
        ? "border-sky-100 bg-sky-50"
        : "border-slate-100 bg-slate-50"
    }`}
  >
    <p
      className={`text-xs font-semibold ${tone === "info" ? "text-sky-700" : "text-slate-500"}`}
    >
      {label}
    </p>
    <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-700">
      {showValue(children)}
    </p>
  </div>
);

// ---------------------------------------------------------
// Read-only report. This is the node used by Print / PDF.
// ---------------------------------------------------------
const OperationReport = ({ operation, reportRef }) => {
  const items = Array.isArray(operation.items) ? operation.items : EMPTY_ITEMS;
  const totalQuantity = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );

  return (
    <div
      ref={reportRef}
      className="space-y-5 bg-slate-50 p-1 print:bg-white print:p-0"
    >
      <div className="rounded-xl bg-slate-900 p-5 text-white sm:p-6 print:rounded-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <CheckCircle2 size={16} aria-hidden="true" />
              Verified EuroMed Official Record
            </div>
            <h2 className="mt-2 wrap-break-word text-xl font-bold sm:text-2xl">
              Operation:{" "}
              <span className="font-mono text-sky-300">
                {showValue(operation.patient_access_code)}
              </span>
            </h2>
            <p className="mt-1 break-all text-xs text-slate-300">
              {showValue(operation.invoice_number)}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200">
            <ShieldCheck size={16} aria-hidden="true" />
            Operation Record
          </div>
        </div>
      </div>

      <DetailsCard>
        <SectionHeader
          icon={ClipboardList}
          title="Operation Information"
          subtitle="General details of the medical procedure"
        />
        <div className="mt-5 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2 xl:grid-cols-4">
          <InfoField
            icon={KeyRound}
            label="Operation Code"
            value={operation.patient_access_code}
            mono
          />
          <InfoField
            icon={CalendarDays}
            label="Operation Date"
            value={formatDate(operation.operation_date)}
          />
          <InfoField
            label="Operation Type"
            value={getName(operation.operation_type?.name)}
          />

          <InfoField icon={Layers3} label="Side" value={operation.side} />
        </div>
        {operation.description && (
          <Notes label="Operation Description">{operation.description}</Notes>
        )}
      </DetailsCard>

      <div
        className="
    grid grid-cols-1 gap-5
    lg:grid-cols-3
    print:grid-cols-3
    print:gap-2
    print:items-start
  "
      >
        {operation.patient && (
          <DetailsCard>
            <SectionHeader
              icon={UserRound}
              title="Patient Information"
              subtitle="Patient details"
            />
            <div
              className="
  mt-5 grid grid-cols-1 gap-5
  border-t border-slate-100 pt-5
  sm:grid-cols-2
  print:mt-2
  print:grid-cols-1
  print:gap-2
  print:pt-2
"
            >
              <InfoField
                icon={UserRound}
                label="Patient Name"
                value={getName(operation.patient.name)}
              />
              <InfoField
                icon={Phone}
                label="Phone"
                value={operation.patient.phone}
              />
              <InfoField
                label="Age (as recorded)"
                value={operation.patient.age}
              />
              <InfoField label="Gender" value={operation.patient.gender} />
              <InfoField
                icon={CalendarDays}
                label="Date of Birth"
                value={formatDate(operation.patient.date_of_birth)}
              />
            </div>
          </DetailsCard>
        )}

        {operation.doctor && (
          <DetailsCard>
            <SectionHeader
              icon={Stethoscope}
              title="Attending Doctor"
              subtitle="Physician responsible for the operation"
            />
            <div
              className="
  mt-5 grid grid-cols-1 gap-5
  border-t border-slate-100 pt-5
  sm:grid-cols-2
  print:mt-2
  print:grid-cols-1
  print:gap-2
  print:pt-2
"
            >
              <InfoField
                icon={Stethoscope}
                label="Doctor Name"
                value={getName(operation.doctor.name)}
              />
              <InfoField
                icon={Hash}
                label="Doctor ID"
                value={operation.doctor.id}
              />
              <InfoField label="User ID" value={operation.doctor.user_id} />
            </div>
            <Notes label="Specialization">
              {getName(operation.doctor.specialization)}
            </Notes>
          </DetailsCard>
        )}

        {operation.hospital && (
          <DetailsCard>
            <SectionHeader
              icon={Building2}
              title="Hospital Information"
              subtitle="Medical facility details"
            />
            <div
              className="
  mt-5 grid grid-cols-1 gap-5
  border-t border-slate-100 pt-5
  sm:grid-cols-2
  print:mt-2
  print:grid-cols-1
  print:gap-2
  print:pt-2
"
            >
              <InfoField
                icon={Building2}
                label="Hospital"
                value={getName(operation.hospital.name)}
              />
              <InfoField
                label="Hospital Type"
                value={operation.hospital.type}
              />
              <InfoField
                icon={MapPin}
                label="City"
                value={getName(operation.hospital.city)}
              />
            </div>
          </DetailsCard>
        )}
      </div>

      <DetailsCard>
        <SectionHeader
          icon={Package}
          title="Surgical Materials & Products"
          subtitle="Materials associated with this operation"
          right={
            <div className="flex flex-wrap gap-2">
              <span className="rounded-lg bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700">
                {items.length} Materials
              </span>
              <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                {totalQuantity} Total Quantity
              </span>
            </div>
          }
        />
        <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 print:mt-2 print:overflow-visible">
          <table className="w-full min-w-155 border-collapse text-center text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 border-r border-slate-200">
                  #
                </th>
                <th scope="col" className="px-4 py-3 border-r border-slate-200">
                  Code
                </th>
                <th scope="col" className="px-4 py-3 border-r border-slate-200">
                  Product
                </th>

                <th
                  scope="col"
                  className="px-4 py-3 text-center border-r border-slate-200"
                >
                  Quantity
                </th>
                <th scope="col" className="px-4 py-3 text-center ">
                  Product Image
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length > 0 ? (
                items.map((item, index) => {
                  const imageUrl =
                    typeof item?.product?.image_url === "string" &&
                    /^https?:\/\//i.test(item?.product?.image_url)
                      ? item?.product?.image_url
                      : null;
                  return (
                    <tr key={item.id ?? index} className="hover:bg-sky-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-500 border border-slate-200">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3 border border-slate-200">
                        <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-700">
                          {showValue(item.product?.code)}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-xs text-slate-600 border border-slate-200">
                        <div className="flex min-w-56 items-center justify-center gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800">
                              {getName(item.product?.name)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center font-semibold text-sky-700 border border-slate-200">
                        {showValue(item.quantity)}
                      </td>

                      <td className="px-4 py-3 text-slate-700 border border-slate-200">
                        <div className="flex items-center justify-center w-full h-full">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item?.name || "Product"}
                              className="w-15 h-10 object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <Package size={22} className="text-slate-400" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    No materials available for this operation.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DetailsCard>
    </div>
  );
};

// ---------------------------------------------------------
// Public patient verification portal
// ---------------------------------------------------------
const OperationDetailsPage = () => {
  const {
    code,
    setCode,
    date,
    setDate,
    errorMessage,
    operationData,
    isDownloading,
    printRef,
    isLoading,
    handleVerify,
    handlePrint,
    handleDownloadPdf,
  } = useOperationDetailsPageLogic();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <main className="min-h-screen bg-slate-50 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          {/* Intro banner */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center text-white shadow-sm sm:p-9">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/15 px-3 py-1.5 text-[10px] sm:text-xs font-bold text-sky-300">
              <ShieldCheck size={14} aria-hidden="true" />
              Secure Verification Portal
            </span>
            <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ">
              Patient Operation &amp; Material Portal
            </h1>
            <p className="mx-auto mt-3 max-w-3xl text-xs sm:text-sm leading-6 text-slate-300">
              Verify the official medical hardware, manufacturer lot codes, and
              surgical materials used in your operation.
            </p>
          </div>

          {/* Code + date verification (never included in print/PDF). */}
          <DetailsCard>
            <SectionHeader
              icon={Search}
              title="Verify Your Operation"
              subtitle="Enter the operation code and date to view your medical record."
            />
            <form
              onSubmit={handleVerify}
              className="mt-5 grid grid-cols-1 items-end gap-4 border-t border-slate-100 pt-5 md:grid-cols-12"
            >
              <div className="md:col-span-5">
                <label
                  htmlFor="operation-code"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Operation Code
                </label>
                <div className="relative">
                  <KeyRound
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="operation-code"
                    type="text"
                    required
                    autoComplete="off"
                    placeholder="A0001"
                    value={code}
                    onChange={(event) =>
                      setCode(event.target.value.toUpperCase())
                    }
                    disabled={isLoading}
                    className={`${INPUT_CLASS} pl-10 font-mono`}
                  />
                </div>
              </div>
              <div className="md:col-span-4">
                <label
                  htmlFor="operation-date"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Operation Date
                </label>
                <div className="relative">
                  <CalendarDays
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="operation-date"
                    type="date"
                    required
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    disabled={isLoading}
                    className={`${INPUT_CLASS} pl-10`}
                  />
                </div>
              </div>
              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Search size={17} />
                  )}
                  {isLoading ? "Verifying..." : "View Details"}
                </button>
              </div>
            </form>

            {errorMessage && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle
                  size={18}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0"
                />
                <p>{errorMessage}</p>
              </div>
            )}
          </DetailsCard>

          {operationData && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-emerald-700">
                    Verification successful
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-800">
                    Operation Details
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handlePrint()}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Printer size={17} />
                    Print Certificate
                  </button>
                  <button
                    type="button"
                    disabled={isDownloading}
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDownloading ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <Download size={17} />
                    )}
                    {isDownloading ? "Generating..." : "Download PDF"}
                  </button>
                </div>
              </div>
              <OperationReport
                reportRef={printRef}
                className="
    operation-report
    space-y-5 bg-slate-50 p-1
    print:space-y-2
    print:bg-white
    print:p-0
  "
                operation={operationData}
              />
            </>
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default OperationDetailsPage;
