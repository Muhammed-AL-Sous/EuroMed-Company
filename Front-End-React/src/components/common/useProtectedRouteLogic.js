import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectAuthReady } from "../../features/auth/authSlice";
const useProtectedRouteLogic = () => {
  const user = useSelector(selectCurrentUser);
  const authReady = useSelector(selectAuthReady);
  const location = useLocation();
  const currentRole = user?.role?.role_name;
  return {
    user,
    authReady,
    location,
    currentRole
  };
};
export default useProtectedRouteLogic;
