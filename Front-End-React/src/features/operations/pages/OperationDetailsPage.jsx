import { useState } from "react";
import { Link, useParams } from "react-router";

// Icons
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  Hash,
  Layers3,
  MapPin,
  Package,
  Phone,
  RefreshCcw,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";

// API
import { useGetOperationQuery } from "../OperationsApiSlice";

// Constants
const EMPTY_ITEMS = [];

// Helpers
const formatDate = (value) => {
  if (!value) return "—";

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) return "—";

  const [, year, month, day] = match;

  return `${day}/${month}/${year}`;
};

const displayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
};

const formatGender = (value) => {
  if (!value) return "—";

  return (
    String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase()
  );
};

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const price = Number(value);

  if (!Number.isFinite(price)) return "—";

  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Reusable Components
const DetailsCard = ({ children, className = "" }) => {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
};

const SectionHeader = ({ icon: Icon, title, subtitle }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
        <Icon size={20} />
      </div>

      <div className="min-w-0">
        <h2 className="text-base font-bold text-slate-800">{title}</h2>

        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

const InfoField = ({ icon: Icon, label, value }) => {
  return (
    <div className="min-w-0 space-y-1.5">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        {Icon && <Icon size={15} className="shrink-0" />}

        <span>{label}</span>
      </div>

      <p className="wrap-break-word text-sm font-semibold text-slate-800">
        {displayValue(value)}
      </p>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-16 w-64 rounded-lg bg-slate-200" />

      <div className="h-48 rounded-xl bg-slate-200" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="h-60 rounded-xl bg-slate-200" />
        <div className="h-60 rounded-xl bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="h-52 rounded-xl bg-slate-200" />
        <div className="h-52 rounded-xl bg-slate-200" />
      </div>

      <div className="h-72 rounded-xl bg-slate-200" />
    </div>
  );
};

const ErrorState = ({ error, onRetry }) => {
  const status = error?.status;

  const message =
    status === 403
      ? "You do not have permission to view this operation."
      : status === 404
        ? "The requested operation was not found."
        : "Unable to load operation details. Please try again.";

  return (
    <div className="flex min-h-96 items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <AlertCircle size={42} className="mx-auto mb-4 text-red-600" />

        <h2 className="text-lg font-bold text-slate-800">
          Operation Details Unavailable
        </h2>

        <p className="mt-2 text-sm text-slate-500">{message}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/admin/operations"
            className="inline-flex items-center gap-2 rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-800"
          >
            <ArrowLeft size={16} />
            Back to Operations
          </Link>

          {status !== 403 && status !== 404 && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <RefreshCcw size={16} />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Operation Materials Table
const OperationMaterialsTable = ({ items }) => {
  const [search, setSearch] = useState("");

  const searchTerm = search.trim().toLowerCase();

  const filteredItems = items.filter((item) => {
    if (!searchTerm) return true;

    const product = item.product;

    return [product?.name, product?.code, product?.description]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(searchTerm));
  });

  const totalQuantity = items.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );

  return (
    <DetailsCard>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionHeader
          icon={Package}
          title="Operation Materials"
          subtitle="Products and materials used in this operation"
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700">
            {items.length} Materials
          </span>

          <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
            {totalQuantity} Total Quantity
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mt-5 max-w-md">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search materials by name or code..."
          aria-label="Search operation materials"
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      {/* Table */}
      <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 border-collapse text-left text-sm">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th scope="col" className="px-4 py-3 font-semibold">
                  #
                </th>

                <th scope="col" className="px-4 py-3 font-semibold">
                  Product
                </th>

                <th scope="col" className="px-4 py-3 font-semibold">
                  Product Code
                </th>

                <th scope="col" className="px-4 py-3 text-center font-semibold">
                  Quantity
                </th>

                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Catalog Price
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                  const product = item.product;

                  const imageUrl =
                    typeof product?.image_url === "string" &&
                    /^https?:\/\//i.test(product.image_url)
                      ? product.image_url
                      : null;

                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-sky-50/50"
                    >
                      {/* Index */}
                      <td className="px-4 py-4 text-slate-500">{index + 1}</td>

                      {/* Product */}
                      <td className="px-4 py-4">
                        <div className="flex min-w-56 items-center gap-3">
                          <div className="flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product?.name || "Product"}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            ) : (
                              <Package size={22} className="text-slate-400" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800">
                              {displayValue(product?.name)}
                            </p>

                            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                              {product?.description ||
                                "No description available"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="px-4 py-4">
                        <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-700">
                          {displayValue(product?.code)}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex min-w-10 justify-center rounded-full bg-sky-50 px-3 py-1 font-semibold tabular-nums text-sky-700">
                          {displayValue(item.quantity)}
                        </span>
                      </td>

                      {/* Catalog Price */}
                      <td className="px-4 py-4 text-right font-semibold tabular-nums text-slate-700">
                        {formatPrice(product?.price)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center">
                    <Package
                      size={36}
                      className="mx-auto mb-3 text-slate-300"
                    />

                    <p className="font-semibold text-slate-700">
                      {searchTerm
                        ? "No matching materials found"
                        : "No materials added to this operation"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {searchTerm
                        ? "Try searching with another product name or code."
                        : "Operation materials will appear here when available."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Catalog prices reflect current product values, not necessarily the
        prices at the time of the operation.
      </p>
    </DetailsCard>
  );
};

// Main Component
const OperationDetailsPage = () => {
  const { id } = useParams();

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetOperationQuery(id, {
    skip: !id,
  });
  console.log(response);
  // Supports wrapped and directly transformed responses.
  const operation = response?.data ?? response;

  // Stable fallback array
  const items = Array.isArray(operation?.items) ? operation.items : EMPTY_ITEMS;

  // Loading State
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  // Error State
  if (isError || !operation?.id) {
    return (
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
        <ErrorState error={error} onRetry={id ? refetch : undefined} />
      </div>
    );
  }

  // Relations
  const patient = operation.patient;
  const doctor = operation.doctor;
  const hospital = operation.hospital;
  const operationType = operation.operation_type;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6">
      {/* Page Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/operations"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-sky-700 transition-colors hover:text-sky-900"
          >
            <ArrowLeft size={17} />
            Back to Operations
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">
              Operation Details
            </h1>

            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              #{operation.id}
            </span>

            {isFetching && (
              <RefreshCcw size={16} className="animate-spin text-sky-600" />
            )}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Complete information about the selected operation.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
          <ShieldCheck size={17} />
          Operation Record
        </div>
      </header>

      {/* Operation Summary */}
      <DetailsCard>
        <SectionHeader
          icon={ClipboardList}
          title="Operation Summary"
          subtitle="General information about this operation"
        />

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoField icon={Hash} label="Operation ID" value={operation.id} />

          <InfoField
            icon={CalendarDays}
            label="Operation Date"
            value={formatDate(operation.operation_date)}
          />

          <InfoField
            icon={Layers3}
            label="Operation Side"
            value={operation.side}
          />

          <InfoField
            icon={Package}
            label="Number of Materials"
            value={operation.items_count ?? items.length}
          />
        </div>

        <div className="mt-5 border-t border-slate-100 pt-5">
          <InfoField
            icon={FileText}
            label="Invoice Number"
            value={operation.invoice_number}
          />
        </div>
      </DetailsCard>

      {/* Patient and Doctor */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Patient */}
        <DetailsCard>
          <SectionHeader
            icon={UserRound}
            title="Patient Information"
            subtitle="Personal information of the patient"
          />

          <div className="mt-5 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <InfoField
              icon={UserRound}
              label="Patient Name"
              value={patient?.name}
            />

            <InfoField icon={Hash} label="Patient ID" value={patient?.id} />

            <InfoField
              icon={Phone}
              label="Phone Number"
              value={patient?.phone}
            />

            <InfoField label="Gender" value={formatGender(patient?.gender)} />

            <InfoField
              icon={CalendarDays}
              label="Date of Birth"
              value={formatDate(patient?.date_of_birth)}
            />
          </div>
        </DetailsCard>

        {/* Doctor */}
        <DetailsCard>
          <SectionHeader
            icon={Stethoscope}
            title="Doctor Information"
            subtitle="Doctor responsible for this operation"
          />

          <div className="mt-5 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <InfoField
              icon={Stethoscope}
              label="Doctor Name"
              value={doctor?.name}
            />

            <InfoField icon={Hash} label="Doctor ID" value={doctor?.id} />
          </div>
        </DetailsCard>
      </div>

      {/* Hospital and Operation Type */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Hospital */}
        <DetailsCard>
          <SectionHeader
            icon={Building2}
            title="Hospital Information"
            subtitle="Hospital where the operation took place"
          />

          <div className="mt-5 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <InfoField
              icon={Building2}
              label="Hospital Name"
              value={hospital?.name}
            />

            <InfoField label="Hospital Type" value={hospital?.type} />

            <InfoField icon={MapPin} label="City" value={hospital?.city} />
          </div>
        </DetailsCard>

        {/* Operation Type */}
        <DetailsCard>
          <SectionHeader
            icon={ClipboardList}
            title="Operation Type"
            subtitle="Medical procedure classification"
          />

          <div className="mt-5 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <InfoField
              label="Operation Type Name"
              value={operationType?.name}
            />

            <InfoField
              icon={Hash}
              label="Operation Type Code"
              value={operationType?.code}
            />

            <div className="sm:col-span-2">
              <InfoField
                icon={FileText}
                label="Description"
                value={operationType?.description}
              />
            </div>
          </div>
        </DetailsCard>
      </div>

      {/* Operation Description */}
      <DetailsCard>
        <SectionHeader
          icon={FileText}
          title="Operation Description"
          subtitle="Additional notes about the medical procedure"
        />

        <div className="mt-5 rounded-lg border border-slate-100 bg-slate-50 p-4">
          <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-slate-700">
            {operation.description || "No description provided."}
          </p>
        </div>
      </DetailsCard>

      {/* Materials */}
      <OperationMaterialsTable items={items} />
    </div>
  );
};

export default OperationDetailsPage;
