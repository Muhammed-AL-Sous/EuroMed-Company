import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import DoctorsPage from "../pages/DoctorsPage";
import HospitalsPage from "../pages/HospitalsPage";
import ProductsPage from "../pages/ProductsPage";
import OperationDetailsPage from "../pages/OperationDetailsPage";
import ContactPage from "../pages/ContactPage";

export const publicRoutes = [
  {
    index: true,
    element: <HomePage />,
  },

  {
    path: "/about",
    element: <AboutPage />,
  },

  {
    path: "/doctors",
    element: <DoctorsPage />,
  },

  {
    path: "/hospitals",
    element: <HospitalsPage />,
  },

  {
    path: "/products",
    element: <ProductsPage />,
  },

  {
    path: "/operation-details",
    element: <OperationDetailsPage />,
  },

  {
    path: "/contact",
    element: <ContactPage />,
  },
];

// =========== Another Method =========== //

// import HomePage from "../pages/HomePage";

// export const publicRoutes = [
//   {
//     index: true,
//     element: <HomePage />,
//   },

//   {
//     path: "/about",
//     lazy: async () => {
//       const module = await import("../pages/AboutPage");

//       return {
//         Component: module.default,
//       };
//     },
//   },

//   {
//     path: "/doctors",
//     lazy: async () => {
//       const module = await import("../pages/DoctorsPage");

//       return {
//         Component: module.default,
//       };
//     },
//   },

//   {
//     path: "/hospitals",
//     lazy: async () => {
//       const module = await import("../pages/HospitalsPage");

//       return {
//         Component: module.default,
//       };
//     },
//   },

//   {
//     path: "/products",
//     lazy: async () => {
//       const module = await import("../pages/ProductsPage");

//       return {
//         Component: module.default,
//       };
//     },
//   },

//   {
//     path: "/operation-details",
//     lazy: async () => {
//       const module = await import("../pages/OperationDetailsPage");

//       return {
//         Component: module.default,
//       };
//     },
//   },

//   {
//     path: "/contact",
//     lazy: async () => {
//       const module = await import("../pages/ContactPage");

//       return {
//         Component: module.default,
//       };
//     },
//   },
// ];
