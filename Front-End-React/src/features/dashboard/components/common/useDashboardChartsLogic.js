const useDashboardChartsLogic = (hookProps0) => {
  const { monthlyOperations = [], materialDemand = [] } = hookProps0;
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

  const operationsData = monthlyOperations.map((item) => {
    const [year, month] = item.month.split("-");
    const monthIndex = Number(month) - 1;
    return {
      month: `${MONTHS[monthIndex] ?? month} ${year}`,
      count: Number(item.total) || 0,
    };
  });

  const categoryData = materialDemand.map((item) => ({
    category: item.category,
    count: Number(item.count) || 0,
  }));

  const hasMaterialData = categoryData.some((item) => item.count > 0);

  return {
    operationsData,
    categoryData,
    hasMaterialData,
  };
};

export default useDashboardChartsLogic;
