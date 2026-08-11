import HomePage from "../pages/HomePage";

export const publicRoutes = [
  {
    index: true,
    element: <HomePage />,
  },

  {
    path: "/about",
    lazy: async () => {
      const module = await import("../pages/AboutPage");

      return {
        Component: module.default,
      };
    },
  },

  {
    path: "/doctors",
    lazy: async () => {
      const module = await import("../pages/DoctorsPage");

      return {
        Component: module.default,
      };
    },
  },

  {
    path: "/hospitals",
    lazy: async () => {
      const module = await import("../pages/HospitalsPage");

      return {
        Component: module.default,
      };
    },
  },

  {
    path: "/products",
    lazy: async () => {
      const module = await import("../pages/ProductsPage");

      return {
        Component: module.default,
      };
    },
  },

  {
    path: "/operation-details",
    lazy: async () => {
      const module = await import("../pages/OperationDetailsPage");

      return {
        Component: module.default,
      };
    },
  },
];
