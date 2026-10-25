import { Link } from "react-router";

import {
  Activity,
  CalendarDays,
  ClipboardList,
  Hospital,
  Package,
  RefreshCw,
  Stethoscope,
  Users,
} from "lucide-react";

import DashboardCharts from "../components/common/DashboardCharts";

import { useGetDashboardOverviewQuery } from "../DashboardApiSlice";

const numberFormatter = new Intl.NumberFormat("en-US");

function formatDate(value) {
  if (!value) return "—";

  const [year, month, day] = value.slice(0, 10).split("-");

  return `${day}/${month}/${year}`;
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>

        <div className="rounded-lg bg-sky-50 p-2.5 text-sky-700">
          <Icon size={20} />
        </div>
      </div>

      <h3 className="text-3xl font-bold text-slate-800">
        {numberFormatter.format(value ?? 0)}
      </h3>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError, isFetching, refetch } =
    useGetDashboardOverviewQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="mb-4 text-red-700">Unable to load dashboard data.</p>

        <button
          type="button"
          onClick={refetch}
          className="rounded-lg bg-red-700 px-4 py-2 text-sm text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { viewer, stats = {}, recent_operations = [] } = data;

  const isDoctor = viewer?.role === "doctor";

  const statCards = [
    {
      title: "Total Operations",
      value: stats.total_operations,
      icon: ClipboardList,
    },
    {
      title: "Operations This Month",
      value: stats.operations_this_month,
      icon: CalendarDays,
    },
    {
      title: isDoctor ? "Doctor Profile" : "Total Doctors",
      value: stats.doctors,
      icon: Stethoscope,
    },
    {
      title: isDoctor ? "My Patients" : "Total Patients",
      value: stats.patients,
      icon: Users,
    },
    {
      title: isDoctor ? "My Hospitals" : "Total Hospitals",
      value: stats.hospitals,
      icon: Hospital,
    },
    {
      title: isDoctor ? "Products Used" : "Total Products",
      value: stats.products,
      icon: Package,
    },
  ];

  return (
    <main className="space-y-6 p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            EuroMed Management System
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          disabled={isFetching}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {viewer?.profile_required && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Complete your doctor profile to access your operations.
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts
        monthlyOperations={data?.monthly_operations ?? []}
        materialDemand={data?.material_demand_by_category ?? []}
      />

      {/* Recent Operations */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-2">
            <Activity size={19} className="text-sky-700" />

            <h2 className="font-semibold text-slate-800">Recent Operations</h2>
          </div>

          <Link
            to="/admin/operations"
            className="text-sm font-medium text-sky-700 hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3 font-semibold">Invoice</th>
                <th className="px-5 py-3 font-semibold">Doctor</th>
                <th className="px-5 py-3 font-semibold">Patient</th>
                <th className="px-5 py-3 font-semibold">Hospital</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {recent_operations.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No operations found.
                  </td>
                </tr>
              ) : (
                recent_operations.map((operation) => (
                  <tr
                    key={operation.id}
                    className="transition-colors hover:bg-sky-50"
                  >
                    <td className="px-5 py-4">
                      {operation.invoice_number || `#${operation.id}`}
                    </td>

                    <td className="px-5 py-4">
                      {operation.doctor_name || "—"}
                    </td>

                    <td className="px-5 py-4">
                      {operation.patient_name || "—"}
                    </td>

                    <td className="px-5 py-4">
                      {operation.hospital_name || "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {formatDate(operation.operation_date)}
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        to={`/admin/operations/${operation.id}`}
                        className="font-medium text-sky-700 hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
