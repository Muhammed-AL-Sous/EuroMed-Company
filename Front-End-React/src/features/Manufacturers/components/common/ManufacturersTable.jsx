import { Check, SquarePen, Trash, X } from "lucide-react";

const ManufacturersTable = ({ manufacturers = [], onDelete, onEdit }) => {
  const headerCell =
    "bg-sky-500 p-2 sm:p-3 text-sm font-semibold text-white border-b border-slate-300";

  const bodyCell =
    "border-b border-slate-300 px-2 py-3 sm:px-4 text-sm font-medium text-slate-700";
  return (
    // الحاوية الخارجية: للحواف المدوّرة والإطار فقط
    <div className="w-full overflow-hidden rounded-2xl border border-slate-300">
      {/* الحاوية الداخلية: هي المسؤولة عن السكرول الأفقي */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-140 border-separate border-spacing-0 text-center">
          {/* Header */}
          <thead>
            <tr>
              <th className={`${headerCell} border-r`}>Name</th>
              <th className={`${headerCell} border-r`}>Origin</th>
              <th className={`${headerCell} border-r`}>Logo Text</th>
              <th className={`${headerCell} border-r`}>Website</th>
              <th className={`${headerCell} border-r`}>Active</th>
              <th className={`${headerCell} border-r`}>Description</th>
              <th className={headerCell}>Tools</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {manufacturers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-sm text-slate-500">
                  No Manufacturers Found.
                </td>
              </tr>
            )}

            {manufacturers.map((manufacturer, index) => {
              const isLast = index === manufacturers.length - 1;
              const lastRow = isLast ? "border-b-0" : "";

              return (
                <tr key={manufacturer.id} className="group">
                  <td
                    className={`${bodyCell} ${lastRow} border-r group-hover:bg-sky-50 transition-colors duration-200 sm:whitespace-nowrap`}
                  >
                    {manufacturer.name}
                  </td>

                  <td
                    className={`${bodyCell} ${lastRow} border-r group-hover:bg-sky-50 transition-colors duration-200 sm:whitespace-nowrap`}
                  >
                    {manufacturer.origin}
                  </td>
                  <td
                    className={`${bodyCell} ${lastRow} border-r group-hover:bg-sky-50 transition-colors duration-200 sm:whitespace-nowrap`}
                  >
                    {manufacturer.logo_text}
                  </td>

                  <td
                    className={`${bodyCell} ${lastRow} border-r group-hover:bg-sky-50 transition-colors duration-200 sm:whitespace-nowrap`}
                  >
                    {manufacturer.website?.trim() ? (
                      <a
                        href={manufacturer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 hover:underline"
                      >
                        {manufacturer.website}
                      </a>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  <td
                    className={`${bodyCell} ${lastRow} border-r group-hover:bg-sky-50 transition-colors duration-200 sm:whitespace-nowrap`}
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      {manufacturer.is_active ? (
                        <Check className="text-sky-500" />
                      ) : (
                        <X className="text-red-500" />
                      )}
                    </div>
                  </td>

                  <td
                    className={`${bodyCell} ${lastRow} border-r group-hover:bg-sky-50 transition-colors duration-200 sm:whitespace-nowrap`}
                  >
                    {manufacturer.description}
                  </td>

                  <td
                    className={`${bodyCell} ${lastRow} group-hover:bg-sky-50 transition-colors duration-200 whitespace-nowrap`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onDelete?.(manufacturer)}
                        aria-label={`Delete ${manufacturer.name}`}
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

                      <button
                        type="button"
                        onClick={() => onEdit?.(manufacturer)}
                        aria-label={`Edit ${manufacturer.name}`}
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

export default ManufacturersTable;
