const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const useDashboardChartsLogic = ({
  monthlyOperations = [],
  materialDemand = [],
  operationsByType = [],
  isDoctor = false,
}) => {
  const operationsData = monthlyOperations.map((item) => {
    const [year, month] = item.month.split("-");
    const monthIndex = Number(month) - 1;

    return {
      month: `${MONTHS[monthIndex] ?? month} ${year}`,
      count: Number(item.total) || 0,
    };
  });

  const categoryData = isDoctor
    ? operationsByType.map((item) => ({
        category: item.type,
        count: Number(item.count) || 0,
      }))
    : materialDemand.map((item) => ({
        category: item.category,
        count: Number(item.count) || 0,
      }));

  const hasMaterialData = categoryData.some((item) => item.count > 0);

  const chartTitle = isDoctor
    ? "Operations by Type"
    : "Material Usage by Category";

  const quantityLabel = isDoctor ? "Operations" : "Units Consumed";

  return {
    operationsData,
    categoryData,
    hasMaterialData,
    chartTitle,
    quantityLabel,
  };
};

export default useDashboardChartsLogic;
