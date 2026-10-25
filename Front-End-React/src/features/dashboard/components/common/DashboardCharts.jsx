import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#0284c7",
  "#0d9488",
  "#6366f1",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
];

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

const chartCardClass =
  "min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";

const chartTitleClass =
  "mb-6 text-sm font-bold uppercase tracking-wider text-slate-900";

export default function DashboardCharts({
  monthlyOperations = [],
  materialDemand = [],
}) {
  // Format monthly operations data
  const operationsData = monthlyOperations.map((item) => {
    const [year, month] = item.month.split("-");
    const monthIndex = Number(month) - 1;

    return {
      month: `${MONTHS[monthIndex] ?? month} ${year}`,
      count: Number(item.total) || 0,
    };
  });

  // Format material demand data
  const categoryData = materialDemand.map((item) => ({
    category: item.category,
    count: Number(item.count) || 0,
  }));

  const hasMaterialData = categoryData.some((item) => item.count > 0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Operations Monthly Chart */}
      <section className={`${chartCardClass} lg:col-span-8`}>
        <h3 className={chartTitleClass}>Surgical Operations Monthly Trend</h3>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={operationsData}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#64748b"
                fontSize={11}
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                cursor={{
                  fill: "#f1f5f9",
                  radius: 6,
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                }}
                formatter={(value) => [value, "Operations"]}
              />

              <Bar
                dataKey="count"
                fill="#0284c7"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
                animationDuration={900}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Material Demand Donut Chart */}
      <section className={`${chartCardClass} lg:col-span-4`}>
        <h3 className={chartTitleClass}>Material Demand Share</h3>

        {!hasMaterialData ? (
          <div className="flex h-72 items-center justify-center text-sm text-slate-500">
            No material usage data available.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="43%"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={3}
                  cornerRadius={5}
                  stroke="none"
                  animationDuration={900}
                >
                  {categoryData.map((item, index) => (
                    <Cell
                      key={item.category}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [value, "Used Quantity"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={9}
                  wrapperStyle={{
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}
