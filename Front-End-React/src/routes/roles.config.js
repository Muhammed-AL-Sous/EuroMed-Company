import { lazy } from "react";

// ============== Icons ============== //
import {
  BarChart2,
  ClipboardList,
  Hospital,
  Package,
  Settings,
  Stethoscope,
  Users,
  UserRoundGroup,
  Blocks,
  Box,
  RobotArm,
  Plus,
} from "lucide-react";

// ============== Stats Pages ============== //
const AdminStats = lazy(
  () => import("../features/admin/components/common/AdminStats.jsx"),
);

const DoctorStats = lazy(
  () => import("../features/doctors/components/common/DoctorStats.jsx"),
);

const StaffStats = lazy(
  () => import("../features/staff/components/common/StaffStats.jsx"),
);

// ============== Dashboard ============== //
const DashboardPage = lazy(
  () => import("../features/dashboard/pages/DashboardPage"),
);

// ============== Operations ============== //
const OperationsPage = lazy(
  () => import("./../features/operations/pages/OperationsPage"),
);

const CreateOperationPage = lazy(
  () => import("../features/operations/pages/CreateOperationPage.jsx"),
);

// ============== Products ============== //
const ProductsDashboardPage = lazy(
  () => import("../features/products/pages/ProductsDashboardPage.jsx"),
);

const CreateProductPage = lazy(
  () => import("../features/products/pages/CreateProductPage.jsx"),
);

// ============== Categories ============== //
const CategoriesPage = lazy(
  () => import("../features/categories/pages/CategoriesPage.jsx"),
);

const CreateCategoryPage = lazy(
  () => import("../features/categories/pages/CreateCategoryPage.jsx"),
);

// ============== SubCategories ============== //
const SubCategoriesPage = lazy(
  () => import("../features/subCategories/pages/SubCategoriesPage.jsx"),
);

const CreateSubCategoryPage = lazy(
  () => import("../features/subCategories/pages/CreateSubCategoryPage.jsx"),
);

// ============== Manufacturers ============== //
const ManufacturersPage = lazy(
  () => import("../features/manufacturers/pages/ManufacturersPage.jsx"),
);

const CreateManufacturerPage = lazy(
  () => import("../features/manufacturers/pages/CreateManufacturerPage.jsx"),
);

// ============== Doctors ============== //
const DoctorsPage = lazy(
  () => import("../features/doctors/pages/DoctorsPage.jsx"),
);

const CreateDoctorProfilePage = lazy(
  () => import("../features/doctors/pages/CreateDoctorProfilePage.jsx"),
);

// ============== Hospitals ============== //
const HospitalsPage = lazy(
  () => import("./../features/hospitals/pages/HospitalsPage"),
);

const CreateHospitalPage = lazy(
  () => import("../features/hospitals/pages/CreateHospitalPage.jsx"),
);

// ============== Patients ============== //
const PatientsPage = lazy(
  () => import("../features/patients/pages/PatientsPage.jsx"),
);

const CreatePatientPage = lazy(
  () => import("../features/patients/pages/CreatePatientPage.jsx"),
);

// ============== Users ============== //
const UsersPage = lazy(() => import("../features/users/pages/UsersPage.jsx"));

const CreateUserPage = lazy(
  () => import("../features/users/pages/CreateUserPage.jsx"),
);

// ============== Settings ============== //
const EditAccountUserPage = lazy(
  () => import("../features/users/pages/EditAccountUserPage.jsx"),
);

export const ROLES_CONFIG = {
  admin: {
    prefix: "admin",

    statsComponent: AdminStats,

    sidebar: [
      { to: "/admin", label: "Dashboard", icon: BarChart2 },
      {
        label: "Operations",
        icon: ClipboardList,
        children: [
          {
            to: "/admin/operations",
            label: "All Operations",
            icon: ClipboardList,
          },
          {
            to: "/admin/operations/create",
            label: "Create Operation",
          },
        ],
      },
      {
        label: "Products",
        icon: Package,
        children: [
          {
            to: "/admin/products",
            label: "All Products",
            icon: Package,
          },
          {
            to: "/admin/products/create",
            label: "Create Product",
          },
        ],
      },

      {
        label: "Categories",
        icon: Blocks,
        children: [
          {
            to: "/admin/categories",
            label: "All Categories",
            icon: Blocks,
          },
          {
            to: "/admin/categories/create",
            label: "Create Category",
          },
        ],
      },

      {
        label: "Subcategories",
        icon: Box,
        children: [
          {
            to: "/admin/subcategories",
            label: "All Subcategories",
            icon: Box,
          },
          {
            to: "/admin/subcategories/create",
            label: "Create Subcategory",
          },
        ],
      },

      {
        label: "Manufacturers",
        icon: RobotArm,
        children: [
          {
            to: "/admin/manufacturers",
            label: "All Manufacturers",
            icon: RobotArm,
          },
          {
            to: "/admin/manufacturers/create",
            label: "Create Manufacturer",
          },
        ],
      },

      {
        label: "Doctors",
        icon: Stethoscope,
        children: [
          {
            to: "/admin/doctors",
            label: "All Doctors",
            icon: Stethoscope,
          },
          {
            to: "/admin/doctors/create",
            label: "Create Doctor Profile",
          },
        ],
      },

      {
        label: "Hospitals",
        icon: Hospital,
        children: [
          {
            to: "/admin/hospitals",
            label: "All Hospitals",
            icon: Hospital,
          },
          { to: "/admin/hospitals/create", label: "Create Hospital" },
        ],
      },
      {
        label: "Patient Records",
        icon: Users,
        children: [
          { to: "/admin/patients", label: "All Patients", icon: Users },
          { to: "/admin/patients/create", label: "Create Patient" },
        ],
      },

      {
        label: "Users",
        icon: UserRoundGroup,
        children: [
          {
            to: "/admin/users",
            label: "All Users",
            icon: UserRoundGroup,
          },
          {
            to: "/admin/users/create",
            label: "Create User",
          },
        ],
      },
      {
        label: "Settings",
        icon: Settings,
        children: [
          {
            to: "/admin/settings/edit-account",
            label: "Edit Account",
          },
        ],
      },
    ],

    routes: [
      {
        path: "",
        element: DashboardPage,
        action: {
          header: "Dashboard Management",
        },
      },
      {
        path: "operations",
        element: OperationsPage,
        action: {
          label: "Create Operation",
          to: "/admin/operations/create",
          icon: Plus,
          header: "Operations Management",
        },
      },
      {
        path: "operations/create",
        element: CreateOperationPage,
      },

      {
        path: "products",
        element: ProductsDashboardPage,
        action: {
          label: "Create Product",
          to: "/admin/products/create",
          icon: Plus,
          header: "Products Management",
        },
      },
      {
        path: "products/create",
        element: CreateProductPage,
      },

      {
        path: "categories",
        element: CategoriesPage,
        action: {
          label: "Create Category",
          to: "/admin/categories/create",
          icon: Plus,
          header: "Categories Management",
        },
      },
      {
        path: "categories/create",
        element: CreateCategoryPage,
      },

      {
        path: "subcategories",
        element: SubCategoriesPage,
        action: {
          label: "Create SubCategory",
          to: "/admin/subcategories/create",
          icon: Plus,
          header: "Subcategories Management",
        },
      },
      {
        path: "subcategories/create",
        element: CreateSubCategoryPage,
      },

      {
        path: "manufacturers",
        element: ManufacturersPage,
        action: {
          label: "Create Manufacturer",
          to: "/admin/manufacturers/create",
          icon: Plus,
          header: "Manufacturers Management",
        },
      },
      {
        path: "manufacturers/create",
        element: CreateManufacturerPage,
      },

      {
        path: "doctors",
        element: DoctorsPage,
        action: {
          label: "Create Doctor Profile",
          to: "/admin/doctors/create",
          icon: Plus,
          header: "Doctors Management",
        },
      },
      {
        path: "doctors/create",
        element: CreateDoctorProfilePage,
      },

      {
        path: "hospitals",
        element: HospitalsPage,
        action: {
          label: "Create Hospital",
          to: "/admin/hospitals/create",
          icon: Plus,
          header: "Hospitals Management",
        },
      },
      {
        path: "hospitals/create",
        element: CreateHospitalPage,
      },

      {
        path: "patients",
        element: PatientsPage,
        action: {
          label: "Create Patient",
          to: "/admin/patients/create",
          icon: Plus,
          header: "Patients Management",
        },
      },
      {
        path: "patients/create",
        element: CreatePatientPage,
      },

      {
        path: "users",
        element: UsersPage,
        action: {
          label: "Create User",
          to: "/admin/users/create",
          icon: Plus,
          header: "Users Management",
        },
      },
      {
        path: "users/create",
        element: CreateUserPage,
      },

      {
        path: "settings/edit-account",
        element: EditAccountUserPage,
      },
    ],

    colors: ["#0284c7", "#0d9488", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6"],
  },

  doctor: {
    prefix: "doctor",

    doctorComponent: DoctorStats,

    sidebar: [{ icon: BarChart2, label: "Dashboard", to: "/doctor" }],

    routes: [{ path: "", element: DashboardPage }],
  },

  staff: {
    prefix: "staff",

    staffComponent: StaffStats,

    sidebar: [{ icon: BarChart2, label: "Dashboard", to: "/staff" }],

    routes: [{ path: "", element: DashboardPage }],
  },
};
