const useProductsTableLogic = () => {
  const headerCell =
    "bg-sky-500 p-2 sm:p-3 text-sm font-semibold text-white border-b border-slate-300";
  const bodyCell =
    "border-b border-slate-300 px-2 py-3 sm:px-4 text-[11px] md:text-xs font-medium text-slate-700";

  return {
    headerCell,
    bodyCell,
  };
};

export default useProductsTableLogic;
