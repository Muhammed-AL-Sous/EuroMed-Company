import clsx from "clsx";
// import { useSelector } from "react-redux";
import { SquarePen, Trash } from "lucide-react";
const HospitalTable = ({ hospitals, isFetching, onDelete, onEdit }) => {
  return (
    <>
      <div className="relative rounded-2xl border border-collapse border-slate-100">
        <div
          className={clsx(
            "overflow-x-auto rounded-2xl p-4 border border-slate-100 transition-opacity shadow-sm",
            isFetching && "pointer-events-none opacity-60",
          )}
          aria-busy={isFetching || undefined}
        >
          <table className="min-w-full divide-y divide-slate-100 text-center">
            <thead >
              <th className="p-3 border border-slate-300 bg-sky-500 text-white">Hospital Name</th>
              <th className="p-3 border border-slate-300 bg-sky-500 text-white">Hospital Type</th>
              <th className="p-3 border border-slate-300 bg-sky-500 text-white">Hospital City</th>
              <th className="p-3 border border-slate-300 bg-sky-500 text-white">Tools</th>
            </thead>
            <tbody className="divide-y divide-slate-300 border border-slate-300">
              {hospitals?.map((hospital) => (
                <tr
                  key={hospital.id}
                  className="hover:bg-sky-100 transition-colors duration-200"
                >
                  <td className="whitespace-nowrap px-4 py-3 border text-sm border-slate-300 font-medium text-slate-700">
                    {hospital.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm border border-slate-300 font-medium text-slate-700">
                    {hospital.type}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm border border-slate-300 font-medium text-slate-700">
                    {hospital.city}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onDelete(hospital.id)}
                      className="cursor-pointer rounded-lg border border-red-500 px-1 py-1 text-red-500 transition-colors duration-200 hover:border-red-600 hover:text-red-600"
                    >
                      <Trash size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(hospital.id)}
                      className="ms-1 cursor-pointer rounded-lg border border-blue-500 px-1 py-1 text-blue-500 transition-colors duration-200 hover:border-blue-600 hover:text-blue-600"
                    >
                      <SquarePen size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isFetching ? (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-white/40 dark:bg-zinc-950/40"
          aria-hidden
        >
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent dark:border-sky-400" />
        </div>
      ) : null}
    </>
  );
};

export default HospitalTable;
