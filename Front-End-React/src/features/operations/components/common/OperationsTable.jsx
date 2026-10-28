import { Link } from "react-router";
import { Eye, SquarePen, Trash } from "lucide-react";

// ==================================================
// Table Styles
// ==================================================

const headerCell =
  "bg-sky-500 p-2 sm:p-3 text-sm font-semibold text-white border-b border-slate-300 whitespace-nowrap";

const bodyCell =
  "border-b border-slate-300 px-2 py-3 sm:px-4 text-sm font-medium text-slate-700";

// ==================================================
// Helpers
// ==================================================

// Support string and translated names
const getLocalizedName = (value) => {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    return (
      value.en ??
      value.ar ??
      Object.values(value).find((name) => typeof name === "string") ??
      ""
    );
  }

  return "";
};

// Display related entity name
const getRelationName = (relation, id, label) => {
  const name = getLocalizedName(
    relation?.full_name ?? relation?.name ?? relation?.title,
  );

  if (name) return name;

  return id != null ? `${label} #${id}` : "—";
};

// ==================================================
// Operation Table
// ==================================================

const OperationTable = ({
  operations = [],
  onDelete,
  onEdit,
  canEdit = true,
  canDelete = true,
  scope,
}) => {
  return (
    // External Container
    <div className="w-full overflow-hidden rounded-2xl border border-slate-300">
      {/* Horizontal Scroll Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-287.5 border-separate border-spacing-0 text-center">
          {/* ==========================================
              Table Header
          ========================================== */}

          <thead>
            <tr>
              <th className={`${headerCell} border-r`}>Invoice No</th>

              <th className={`${headerCell} border-r`}>Operation Code</th>

              <th className={`${headerCell} border-r`}>Operation Date</th>

              <th className={`${headerCell} border-r`}>Doctor</th>

              <th className={`${headerCell} border-r`}>Patient</th>

              <th className={`${headerCell} border-r`}>Hospital</th>

              <th className={`${headerCell} border-r`}>Operation Type</th>

              <th className={`${headerCell} border-r`}>Side</th>

              <th className={`${headerCell} border-r`}>Items</th>

              <th className={headerCell}>Tools</th>
            </tr>
          </thead>

          {/* ==========================================
              Table Body
          ========================================== */}

          <tbody>
            {operations.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-sm text-slate-500">
                  No Operations Found.
                </td>
              </tr>
            )}

            {operations.map((operation, index) => {
              const isLast = index === operations.length - 1;

              const lastRow = isLast ? "border-b-0" : "";

              const hoverClass =
                "group-hover:bg-sky-50 transition-colors duration-200";

              const operationLabel =
                operation.invoice_number ?? `Operation #${operation.id}`;

              const itemsCount =
                operation.items_count ??
                (Array.isArray(operation.items) ? operation.items.length : "—");

              return (
                <tr key={operation.id} className="group">
                  {/* Invoice Number */}
                  <td
                    className={`${bodyCell} ${lastRow} border-r ${hoverClass} whitespace-nowrap`}
                  >
                    <span className="font-semibold text-sky-800">
                      {operation.invoice_number ?? "—"}
                    </span>
                  </td>

                  <td
                    className={`${bodyCell} ${lastRow} border-r ${hoverClass} whitespace-nowrap`}
                  >
                    <span className="font-semibold text-sky-800">
                      {operation.patient_access_code ?? "—"}
                    </span>
                  </td>

                  {/* Operation Date */}
                  <td
                    className={`${bodyCell} ${lastRow} border-r ${hoverClass} whitespace-nowrap`}
                  >
                    <time
                      dateTime={operation.operation_date ?? undefined}
                      dir="ltr"
                    >
                      {operation.operation_date}
                    </time>
                  </td>

                  {/* Doctor */}
                  <td
                    className={`${bodyCell} ${lastRow} border-r ${hoverClass} sm:whitespace-nowrap`}
                  >
                    {getRelationName(
                      operation.doctor,
                      operation.doctor_id,
                      "Doctor",
                    )}
                  </td>

                  {/* Patient */}
                  <td
                    className={`${bodyCell} ${lastRow} border-r ${hoverClass} sm:whitespace-nowrap`}
                  >
                    {getRelationName(
                      operation.patient,
                      operation.patient_id,
                      "Patient",
                    )}
                  </td>

                  {/* Hospital */}
                  <td
                    className={`${bodyCell} ${lastRow} border-r ${hoverClass} sm:whitespace-nowrap`}
                  >
                    {getRelationName(
                      operation.hospital,
                      operation.hospital_id,
                      "Hospital",
                    )}
                  </td>

                  {/* Operation Type */}
                  <td
                    className={`${bodyCell} ${lastRow} border-r ${hoverClass} sm:whitespace-nowrap`}
                  >
                    {getRelationName(
                      operation.operation_type,
                      operation.operation_type_id,
                      "Type",
                    )}
                  </td>

                  {/* Operation Side */}
                  <td
                    className={`${bodyCell} ${lastRow} border-r ${hoverClass} whitespace-nowrap`}
                  >
                    {operation.side ?? "—"}
                  </td>

                  {/* Operation Items Count */}
                  <td
                    className={`${bodyCell} ${lastRow} border-r ${hoverClass} whitespace-nowrap`}
                  >
                    <span className="inline-flex min-w-8 items-center justify-center rounded-lg bg-sky-100 px-2 py-1 text-xs font-bold text-sky-700">
                      {itemsCount}
                    </span>
                  </td>

                  {/* ==================================
                      Tools
                  ================================== */}

                  <td
                    className={`${bodyCell} ${lastRow} ${hoverClass} whitespace-nowrap`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {/* View Operation */}
                      <Link
                        to={`/${scope}/operations/${operation.id}`}
                        aria-label={`View ${operationLabel}`}
                        title="View Operation Details"
                        className="
                          cursor-pointer
                          rounded-lg
                          border border-emerald-500
                          p-1
                          text-emerald-600
                          transition-colors
                          duration-200
                          hover:border-emerald-600
                          hover:bg-emerald-50
                          hover:text-emerald-700
                        "
                      >
                        <Eye size={18} aria-hidden="true" />
                      </Link>

                      {/* Edit Operation */}
                      {scope === "admin"
                        ? canEdit &&
                          typeof onEdit === "function" && (
                            <button
                              type="button"
                              onClick={() => onEdit(operation)}
                              aria-label={`Edit ${operationLabel}`}
                              title="Edit Operation"
                              className="
                            cursor-pointer
                            rounded-lg
                            border border-blue-500
                            p-1
                            text-blue-500
                            transition-colors
                            duration-200
                            hover:border-blue-600
                            hover:bg-blue-50
                            hover:text-blue-600
                          "
                            >
                              <SquarePen size={18} aria-hidden="true" />
                            </button>
                          )
                        : null}

                      {/* Delete Operation */}
                      {scope === "admin"
                        ? canDelete &&
                          typeof onDelete === "function" && (
                            <button
                              type="button"
                              onClick={() => onDelete(operation)}
                              aria-label={`Delete ${operationLabel}`}
                              title="Delete Operation"
                              className="
                              cursor-pointer
                              rounded-lg
                              border border-red-500
                              p-1
                              text-red-500
                              transition-colors
                              duration-200
                              hover:border-red-600
                              hover:bg-red-50
                              hover:text-red-600
                            "
                            >
                              <Trash size={18} aria-hidden="true" />
                            </button>
                          )
                        : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperationTable;
