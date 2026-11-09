import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";

const useUnauthorizedPageLogic = () => {
  const user = useSelector(selectCurrentUser);

  const homePaths = {
    admin: "/admin",
    doctor: "/doctor",
    staff: "/staff",
  };

  const homePath = homePaths[user?.role?.role_name] ?? "/login";

  return {
    homePath,
  };
};

export default useUnauthorizedPageLogic;
