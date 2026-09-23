import { Provider } from "react-redux";
import { RouterProvider } from "react-router/dom";
import { store } from "./store/store";
import { router } from "./routes/index";
import AuthInitializer from "./features/auth/components/common/AuthInitializer";

const App = () => {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </Provider>
  );
};

export default App;
