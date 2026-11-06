import { RouterProvider } from "react-router/dom";
import { createPortal } from "react-dom";
import { store } from "./store/store";
import { router } from "./routes/index";
import AuthInitializer from "./features/auth/components/common/AuthInitializer";
import { Toaster } from "sonner";
import { Provider } from "react-redux";

// Components
import SiteLoader from "./components/common/SiteLoader";

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
        <RouterProvider
          router={router}
          fallbackElement={<SiteLoader fullScreen />}
        />
      </AuthInitializer>
    </Provider>
  );
};

export default App;
