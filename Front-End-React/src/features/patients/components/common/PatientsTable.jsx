import { SquarePen, Trash } from "lucide-react";

const PatientsTable = ({ Patients = [], onDelete, onEdit }) => {
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
              <th className={`${headerCell} border-r`}>Phone</th>
              <th className={`${headerCell} border-r`}>Age</th>
              <th className={`${headerCell} border-r`}>Date Of Birth</th>
              <th className={`${headerCell} border-r`}>Gender</th>
              <th className={headerCell}>Tools</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {Patients.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-sm text-slate-500">
                  No Patients Found.
                </td>
              </tr>
            )}

            {Patients.map((Patient, index) => {
              const isLast = index === Patients.length - 1;
              const lastRow = isLast ? "border-b-0" : "";

              return (
                <tr key={Patient.id} className="group">
                  <td
                    className={`${bodyCell} ${lastRow} border-r group-hover:bg-sky-50 transition-colors duration-200 sm:whitespace-nowrap`}
                  >
                    {Patient.name}
                  </td>

                  <td
                    className={`${bodyCell} ${lastRow} border-r group-hover:bg-sky-50 transition-colors duration-200 sm:whitespace-nowrap`}
                  >
                    {Patient.phone}
                  </td>

                  <td
                    className={`${bodyCell} ${lastRow} border-r group-hover:bg-sky-50 transition-colors duration-200 sm:whitespace-nowrap`}
                  >
                    {Patient.age} Years
                  </td>

                  <td
                    className={`${bodyCell} ${lastRow} border-r group-hover:bg-sky-50 transition-colors duration-200 sm:whitespace-nowrap`}
                  >
                    {Patient.date_of_birth
                      ? Patient.date_of_birth.split("-").reverse().join("-")
                      : "—"}
                  </td>

                  <td
                    className={`${bodyCell} ${lastRow} border-r capitalize group-hover:bg-sky-50 transition-colors duration-200 sm:whitespace-nowrap`}
                  >
                    {Patient.gender}
                  </td>
                  
                  <td
                    className={`${bodyCell} ${lastRow} group-hover:bg-sky-50 transition-colors duration-200 whitespace-nowrap`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onDelete?.(Patient)}
                        aria-label={`Delete ${Patient.name}`}
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
                        onClick={() => onEdit?.(Patient)}
                        aria-label={`Edit ${Patient.name}`}
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

export default PatientsTable;
