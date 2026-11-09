import { useLocation } from "react-router";
import {
  CalendarDays,
  ClipboardList,
  Hospital,
  Package,
  Stethoscope,
  Users,
} from "lucide-react";
import { useGetDashboardOverviewQuery } from "../DashboardApiSlice";

const useDashboardPageLogic = () => {
  const location = useLocation();

  const scope =
    location.pathname === "/doctor" || location.pathname.startsWith("/doctor/")
      ? "doctor"
      : "admin";

  const { data, isLoading, isError, isFetching, refetch } =
    useGetDashboardOverviewQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  const { viewer, stats = {}, recent_operations = [] } = data ?? {};
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

  return {
    scope,
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
    viewer,
    recent_operations,
    statCards,
  };
};

export default useDashboardPageLogic;
