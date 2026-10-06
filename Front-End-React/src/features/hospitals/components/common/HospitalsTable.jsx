import { SquarePen, Trash } from "lucide-react";

const HospitalsTable = ({ hospitals = [], onDelete, onEdit }) => {
  return (
    <div className="overflow-x-auto rounded-2xl p-4">
      <table className="min-w-full border-collapse text-center">
        {/* ==================================================
            Table Header
        ================================================== */}

        <thead>
          <tr>
            <th className="border border-slate-300 bg-sky-500 p-3 text-sm font-semibold text-white">
              Hospital Name
            </th>

            <th className="border border-slate-300 bg-sky-500 p-3 text-sm font-semibold text-white">
              Hospital Type
            </th>

            <th className="border border-slate-300 bg-sky-500 p-3 text-sm font-semibold text-white">
              Hospital City
            </th>

            <th className="border border-slate-300 bg-sky-500 p-3 text-sm font-semibold text-white">
              Tools
            </th>
          </tr>
        </thead>

        {/* ==================================================
            Table Body
        ================================================== */}

        <tbody>
          {hospitals.map((hospital) => (
            <tr
              key={hospital.id}
              className="
                transition-colors
                duration-200
                hover:bg-sky-50
              "
            >
              {/* Hospital Name */}
              <td
                className="
                  whitespace-nowrap
                  border border-slate-300
                  px-4 py-3
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                {hospital.name}
              </td>

              {/* Hospital Type */}
              <td
                className="
                  whitespace-nowrap
                  border border-slate-300
                  px-4 py-3
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                {hospital.type}
              </td>

              {/* Hospital City */}
              <td
                className="
                  whitespace-nowrap
                  border border-slate-300
                  px-4 py-3
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                {hospital.city}
              </td>

              {/* Tools */}
              <td
                className="
                  whitespace-nowrap
                  border border-slate-300
                  px-4 py-3
                "
              >
                <div className="flex items-center justify-center gap-2">
                  {/* Delete */}
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

                  {/* Edit */}
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
  );
};

export default HospitalsTable;
