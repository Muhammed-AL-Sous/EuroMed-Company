import { lazy } from "react";

// ============== Icons ============== //
import {
  Award,
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
const ProductsPage = lazy(
  () => import("../features/products/pages/ProductsPage.jsx"),
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
          },
          { to: "/admin/hospitals/create", label: "Create Hospital" },
        ],
      },
      {
        label: "Patient Records",
        icon: Users,
        children: [
          { to: "/admin/patients", label: "All Patients" },
          { to: "/admin/patients/create", label: "Create Patient" },
        ],
      },
      {
        label: "Brands",
        icon: Award,
        children: [
          {
            to: "/admin/brands",
            label: "All Brands",
          },
          {
            to: "/admin/brands/create",
            label: "Create Brand",
          },
        ],
      },
      {
        label: "Users",
        icon: UserRoundGroup,
        children: [
          {
            to: "/admin/users",
            label: "All Users",
          },
          {
            to: "/admin/users/create",
            label: "Create User",
          },
        ],
      },
      {
        to: "/admin/settings",
        label: "Settings",
        icon: Settings,
      },
    ],

    routes: [
      { path: "", element: DashboardPage },
      {
        path: "operations",
        element: OperationsPage,
        action: {
          label: "Create Operation",
          to: "/admin/operations/create",
          icon: Plus,
        },
      },
      {
        path: "operations/create",
        element: CreateOperationPage,
      },

      {
        path: "products",
        element: ProductsPage,
        action: {
          label: "Create Product",
          to: "/admin/products/create",
          icon: Plus,
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
        },
      },
      {
        path: "subcategories/create",
        element: CreateSubCategoryPage,
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
