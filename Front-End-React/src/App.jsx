import { RouterProvider } from "react-router/dom";
import { createPortal } from "react-dom";
import { store } from "./store/store";
import { router } from "./routes/index";
import AuthInitializer from "./features/auth/components/common/AuthInitializer";
import { Toaster } from "sonner";
import { Provider } from "react-redux";

const App = () => {
  return (
    <Provider store={store}>
      {createPortal(
        <Toaster
          position="bottom-left"
          richColors
          closeButton
          style={{ zIndex: 999999 }}
        />,
        document.body,
      )}

      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </Provider>
  );
};

export default App;
