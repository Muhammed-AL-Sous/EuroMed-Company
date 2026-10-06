import { SquarePen, Trash } from "lucide-react";

const HospitalsTable = ({ hospitals = [], onDelete, onEdit }) => {
  return (
    <div className="overflow-x-auto">
      <div className="overflow-hidden rounded-2xl border border-slate-300">
        <table className="min-w-full border-separate border-spacing-0 text-center">
          {/* Header */}
          <thead>
            <tr>
              <th className="border-b border-r border-slate-300 bg-sky-500 p-3 text-sm font-semibold text-white">
                Hospital Name
              </th>

              <th className="border-b border-r border-slate-300 bg-sky-500 p-3 text-sm font-semibold text-white">
                Hospital Type
              </th>

              <th className="border-b border-r border-slate-300 bg-sky-500 p-3 text-sm font-semibold text-white">
                Hospital City
              </th>

              <th className="border-b border-slate-300 bg-sky-500 p-3 text-sm font-semibold text-white">
                Tools
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {hospitals.map((hospital, index) => (
              <tr
                key={hospital.id}
                className="transition-colors duration-200 hover:bg-sky-50"
              >
                <td
                  className={`
                    whitespace-nowrap
                    border-b border-r border-slate-300
                    px-4 py-3
                    text-sm font-medium text-slate-700
                    ${index === hospitals.length - 1 ? "border-b-0" : ""}
                  `}
                >
                  {hospital.name}
                </td>

                <td
                  className={`
                    whitespace-nowrap
                    border-b border-r border-slate-300
                    px-4 py-3
                    text-sm font-medium text-slate-700
                    ${index === hospitals.length - 1 ? "border-b-0" : ""}
                  `}
                >
                  {hospital.type}
                </td>

                <td
                  className={`
                    whitespace-nowrap
                    border-b border-r border-slate-300
                    px-4 py-3
                    text-sm font-medium text-slate-700
                    ${index === hospitals.length - 1 ? "border-b-0" : ""}
                  `}
                >
                  {hospital.city}
                </td>

                <td
                  className={`
                    whitespace-nowrap
                    border-b border-slate-300
                    px-4 py-3
                    ${index === hospitals.length - 1 ? "border-b-0" : ""}
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDelete?.(hospital)}
                      aria-label={`Delete ${hospital.name}`}
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
                      onClick={() => onEdit?.(hospital)}
                      aria-label={`Edit ${hospital.name}`}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HospitalsTable;