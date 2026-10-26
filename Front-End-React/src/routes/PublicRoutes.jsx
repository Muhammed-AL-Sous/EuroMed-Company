import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ProductsPage from "../pages/ProductsPage";
import OperationDetailsPage from "../pages/OperationDetailsPage";
import ContactPage from "../pages/ContactPage";
import BrandsPage from "../pages/BrandsPage";
import LoginPage from "../features/auth/pages/LoginPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";

export const publicRoutes = [
  {
    index: true,
    element: <HomePage />,
  },

  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/about",
    element: <AboutPage />,
  },

  {
    path: "/brands",
    element: <BrandsPage />,
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
