import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ClipboardList,
  FileText,
  Hospital,
  KeyRound,
  Package,
  Printer,
  ShieldCheck,
  Stethoscope,
  User,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { useVerifyPatientOperationMutation } from "../features/patients/PatientOperationApiSlice";

const OperationDetailsPage = () => {
  const [searchParams] = useSearchParams();

  const initialCode = searchParams.get("code") || "";
  const initialDate = searchParams.get("date") || "";

  const [code, setCode] = useState(initialCode);
  const [date, setDate] = useState(initialDate);

  const [errorMessage, setErrorMessage] = useState("");
  const [operationData, setOperationData] = useState(null);

  const [verifyPatientOperation, { isLoading }] =
    useVerifyPatientOperationMutation();

  // =========================================================
  // Verify Operation
  // =========================================================

  const handleVerify = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setOperationData(null);

    try {
      const response = await verifyPatientOperation({
        code: code.trim(),
        date,
      }).unwrap();

      console.log("Patient Operation Response:", response);

      if (response?.status && response?.data) {
        setOperationData(response.data);
      } else {
        setErrorMessage(
          response?.message ||
            "We Couldn't Find an Operation Matching The Provided Information.",
        );
      }
    } catch (error) {
      console.error("Patient Operation Error:", error);

      setErrorMessage(
        error?.data?.message ||
          "We Couldn't Find an Operation Matching The Provided Information. Please Verify Your Operation Code And Date.",
      );
    }
  };

  // =========================================================
  // Load Operation From URL
  // =========================================================

  useEffect(() => {
    if (!initialCode || !initialDate) {
      return;
    }

    const loadOperation = async () => {
      setErrorMessage("");
      setOperationData(null);

      try {
        const response = await verifyPatientOperation({
          code: initialCode.trim(),
          date: initialDate,
        }).unwrap();

        console.log("Patient Operation Response:", response);

        if (response?.status && response?.data) {
          setOperationData(response.data);
        } else {
          setErrorMessage(
            response?.message ||
              "We Couldn't Find an Operation Matching The Provided Information.",
          );
        }
      } catch (error) {
        console.error("Patient Operation Error:", error);

        setErrorMessage(
          error?.data?.message ||
            "We Couldn't Find an Operation Matching The Provided Information. Please Verify Your Operation Code And Date.",
        );
      }
    };

    loadOperation();
  }, [initialCode, initialDate]);

  // =========================================================
  // Print
  // =========================================================

  const handlePrint = () => {
    window.print();
  };

  // =========================================================
  // Helpers
  // =========================================================

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getName = (value) => {
    if (!value) return "-";

    if (typeof value === "string") {
      return value;
    }

    return value.en || value.ar || "-";
  };

  const cleanUrl = (url) => {
    if (!url) return null;

    return url.replace("[", "").replace("]", "");
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* =====================================================
            Banner
        ====================================================== */}

        <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider border border-sky-400/30">
            <ShieldCheck className="w-4 h-4" />
            Secure Verification Portal
          </span>

          <h1 className="text-3xl font-black text-white tracking-tight">
            Patient Operation & Material Portal
          </h1>

          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Verify the official medical hardware, manufacturer lot codes, and
            surgical materials used in your operation.
          </p>
        </div>

        {/* =====================================================
            Search Form
        ====================================================== */}

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <form
            onSubmit={handleVerify}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
          >
            {/* Code */}

            <div className="md:col-span-5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Operation Code
              </label>

              <div className="relative">
                <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />

                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="A0001"
                  className="w-full bg-slate-50 text-slate-900 pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-mono font-bold tracking-wider"
                  required
                />
              </div>
            </div>

            {/* Date */}

            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Operation Date
              </label>

              <div className="relative">
                <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm font-mono"
                  required
                />
              </div>
            </div>

            {/* Button */}

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-sky-400 text-white font-bold text-sm transition-all shadow-md shadow-sky-600/20"
              >
                {isLoading ? "Verifying..." : "View Details"}
              </button>
            </div>
          </form>

          {/* Error */}

          {errorMessage && (
            <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />

              <div>{errorMessage}</div>
            </div>
          )}
        </div>

        {/* =====================================================
            RESULT
        ====================================================== */}

        {operationData && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:shadow-none">
            {/* =================================================
                Header
            ================================================== */}

            <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-sky-400 font-bold uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Verified EuroMed Official Record
                </div>

                <h2 className="text-2xl font-black mt-2">
                  Operation:{" "}
                  <span className="text-sky-400 font-mono">
                    {operationData.patient_access_code}
                  </span>
                </h2>

                <p className="text-slate-400 text-sm mt-2">
                  {operationData.invoice_number}
                </p>
              </div>

              <button
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold border border-slate-700 print:hidden"
              >
                <Printer className="w-4 h-4 text-sky-400" />
                Print Certificate
              </button>
            </div>

            {/* =================================================
                Operation Information
            ================================================== */}

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-5">
                <ClipboardList className="w-5 h-5 text-sky-600" />

                <h3 className="text-lg font-bold text-slate-900">
                  Operation Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoCard
                  label="Operation Date"
                  value={formatDate(operationData.operation_date)}
                />

                <InfoCard
                  label="Operation Type"
                  value={operationData.operation_type?.name}
                />

                <InfoCard
                  label="Operation Code"
                  value={operationData.patient_access_code}
                  mono
                />

                <InfoCard label="Side" value={operationData.side} />

                <InfoCard
                  label="Invoice Number"
                  value={operationData.invoice_number}
                  mono
                />

                <InfoCard label="Operation ID" value={operationData.id} />

                <InfoCard
                  label="Created At"
                  value={formatDate(operationData.created_at)}
                />

                <InfoCard
                  label="Updated At"
                  value={formatDate(operationData.updated_at)}
                />
              </div>

              {operationData.description && (
                <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold uppercase text-slate-500">
                    Operation Description
                  </span>

                  <p className="mt-1 text-sm text-slate-700">
                    {operationData.description}
                  </p>
                </div>
              )}
            </div>

            {/* =================================================
                Patient
            ================================================== */}

            {operationData.patient && (
              <div className="p-6 sm:p-8 border-t border-slate-200">
                <SectionTitle
                  icon={<User className="w-5 h-5 text-sky-600" />}
                  title="Patient Information"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoCard
                    label="Patient Name"
                    value={operationData.patient.name}
                  />

                  <InfoCard label="Phone" value={operationData.patient.phone} />

                  <InfoCard label="Age" value={operationData.patient.age} />

                  <InfoCard
                    label="Gender"
                    value={operationData.patient.gender}
                  />

                  <InfoCard
                    label="Date of Birth"
                    value={formatDate(operationData.patient.date_of_birth)}
                  />

                  <InfoCard
                    label="Patient ID"
                    value={operationData.patient.id}
                  />
                </div>
              </div>
            )}

            {/* =================================================
                Doctor
            ================================================== */}

            {operationData.doctor && (
              <div className="p-6 sm:p-8 border-t border-slate-200 bg-slate-50">
                <SectionTitle
                  icon={<Stethoscope className="w-5 h-5 text-sky-600" />}
                  title="Attending Doctor"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <InfoCard
                    label="Doctor Name"
                    value={getName(operationData.doctor.name)}
                  />

                  <InfoCard label="Doctor ID" value={operationData.doctor.id} />

                  <InfoCard
                    label="User ID"
                    value={operationData.doctor.user_id ?? "-"}
                  />
                </div>

                <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold uppercase text-slate-500">
                    Specialization
                  </span>

                  <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                    {getName(operationData.doctor.specialization)}
                  </p>
                </div>
              </div>
            )}

            {/* =================================================
                Hospital
            ================================================== */}

            {operationData.hospital && (
              <div className="p-6 sm:p-8 border-t border-slate-200">
                <SectionTitle
                  icon={<Hospital className="w-5 h-5 text-sky-600" />}
                  title="Hospital Information"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoCard
                    label="Hospital"
                    value={getName(operationData.hospital.name)}
                  />

                  <InfoCard
                    label="Hospital Type"
                    value={operationData.hospital.type}
                  />

                  <InfoCard
                    label="City"
                    value={getName(operationData.hospital.city)}
                  />

                  <InfoCard
                    label="Hospital ID"
                    value={operationData.hospital.id}
                  />
                </div>
              </div>
            )}

            {/* =================================================
                Operation Type
            ================================================== */}

            {operationData.operation_type && (
              <div className="p-6 sm:p-8 border-t border-slate-200 bg-slate-50">
                <SectionTitle
                  icon={<FileText className="w-5 h-5 text-sky-600" />}
                  title="Procedure Information"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoCard
                    label="Procedure"
                    value={operationData.operation_type.name}
                  />

                  <InfoCard
                    label="Code"
                    value={operationData.operation_type.code}
                    mono
                  />

                  <InfoCard
                    label="Product Count"
                    value={operationData.operation_type.product_count}
                  />

                  <InfoCard
                    label="Procedure ID"
                    value={operationData.operation_type.id}
                  />
                </div>

                {operationData.operation_type.description && (
                  <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-200">
                    <span className="text-xs font-bold uppercase text-slate-500">
                      Description
                    </span>

                    <p className="mt-2 text-sm text-slate-700">
                      {operationData.operation_type.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* =================================================
                Products
            ================================================== */}

            <div className="p-6 sm:p-8 border-t border-slate-200">
              <SectionTitle
                icon={<Package className="w-5 h-5 text-sky-600" />}
                title="Surgical Materials & Products"
              />

              <div className="space-y-6">
                {operationData.items?.map((item) => {
                  const product = item.product;

                  if (!product) return null;

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 overflow-hidden"
                    >
                      {/* Product Header */}

                      <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-black text-slate-900">
                            {product.name}
                          </h4>

                          <p className="text-xs font-mono text-slate-500 mt-1">
                            {product.code}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1.5 rounded-lg bg-sky-100 text-sky-700 text-xs font-bold">
                            Quantity: {item.quantity}
                          </span>

                          <span className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold">
                            ${product.price}
                          </span>
                        </div>
                      </div>

                      {/* Product Body */}

                      <div className="p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <InfoCard label="Product ID" value={product.id} />

                          <InfoCard
                            label="Product Code"
                            value={product.code}
                            mono
                          />

                          <InfoCard
                            label="Manufacturer ID"
                            value={product.manufacturer_id}
                          />

                          <InfoCard
                            label="Category ID"
                            value={product.category_id}
                          />

                          <InfoCard
                            label="Subcategory ID"
                            value={product.subcategory_id}
                          />

                          <InfoCard
                            label="Unit Price"
                            value={`$${product.price}`}
                          />

                          <InfoCard
                            label="Used Quantity"
                            value={item.quantity}
                          />

                          <InfoCard label="Item ID" value={item.id} />
                        </div>

                        {/* Image */}

                        {product.image_url && (
                          <div className="mt-5 flex justify-center">
                            <img
                              src={cleanUrl(product.image_url)}
                              alt={product.name}
                              className="w-48 h-48 object-contain rounded-2xl border border-slate-200 bg-white p-4"
                            />
                          </div>
                        )}

                        {/* Description */}

                        {product.description && (
                          <div className="mt-5">
                            <span className="text-xs font-bold uppercase text-slate-500">
                              Product Description
                            </span>

                            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                              {product.description}
                            </p>
                          </div>
                        )}

                        {/* Medical Usage */}

                        {product.medical_usage && (
                          <div className="mt-5 p-4 rounded-2xl bg-sky-50 border border-sky-100">
                            <span className="text-xs font-bold uppercase text-sky-700">
                              Medical Usage
                            </span>

                            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                              {product.medical_usage}
                            </p>
                          </div>
                        )}

                        {/* Specifications */}

                        {product.specifications &&
                          Object.keys(product.specifications).length > 0 && (
                            <div className="mt-5">
                              <span className="text-xs font-bold uppercase text-slate-500">
                                Specifications
                              </span>

                              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {Object.entries(product.specifications).map(
                                  ([key, value]) => (
                                    <div
                                      key={key}
                                      className="p-3 rounded-xl bg-slate-50 border border-slate-200"
                                    >
                                      <span className="block text-[11px] font-bold uppercase text-slate-400">
                                        {key}
                                      </span>

                                      <span className="block mt-1 text-sm font-semibold text-slate-800">
                                        {value}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                        {/* Available Sizes */}

                        {product.available_sizes?.length > 0 && (
                          <div className="mt-5">
                            <span className="text-xs font-bold uppercase text-slate-500">
                              Available Sizes
                            </span>

                            <div className="flex flex-wrap gap-2 mt-3">
                              {product.available_sizes.map((size) => (
                                <span
                                  key={size}
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700"
                                >
                                  {size}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                Footer
            ================================================== */}

            <div className="p-6 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between gap-3 text-xs text-slate-500">
              <span>
                Verification Authority: EuroMed Quality Control & Compliance
                Office, Erbil, Iraq
              </span>

              <span className="font-mono">ISO 13485 Compliant</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================
// Reusable Components
// =============================================================

const InfoCard = ({ label, value, mono = false }) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
      <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>

      <span
        className={`block mt-1 text-sm font-bold text-slate-900 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value ?? "-"}
      </span>
    </div>
  );
};

const SectionTitle = ({ icon, title }) => {
  return (
    <div className="flex items-center gap-2 mb-5">
      {icon}

      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    </div>
  );
};

export default OperationDetailsPage;
