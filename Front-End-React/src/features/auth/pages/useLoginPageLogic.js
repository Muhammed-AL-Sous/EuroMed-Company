import { useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../authApiSlice";
import { setCredentials } from "../authSlice";
import { notifySonner } from "./../../../lib/notifySonner";
import { getPostAuthDestination } from "../logic/postAuthRedirect";
import { getLoginFormErrors } from "../validation/authFormValidators";

const useLoginPageLogic = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const validateLoginForm = () => {
    const newErrors = getLoginFormErrors(loginForm);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const patchClearFieldError = (prevErrors, fieldName) => {
    if (!prevErrors || !prevErrors[fieldName]) return prevErrors;
    return {
      ...prevErrors,
      [fieldName]: null,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => patchClearFieldError(prev, name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const isValid = validateLoginForm();
    if (!isValid) return;

    try {
      const loginPromise = login(loginForm).unwrap();
      const response = await loginPromise;
      const { user } = response.data;
      dispatch(
        setCredentials({
          user,
        }),
      );
      const destination = getPostAuthDestination(user, {
        fallbackPath: location.state?.from?.pathname,
      });
      navigate(destination, {
        replace: true,
      });
      notifySonner("Welcome Back", "success");
    } catch (err) {
      setErrorMessage(
        err?.data?.message || "Login failed. Please Check Your Credentials.",
      );
      const status = err.status;
      if (status === 401) {
        notifySonner("Invalid Email Or Password", "error");
        return;
      }
      notifySonner("Login Failed", "error");
    }
  };

  const handleForgotPassword = () => {
    notifySonner(
      "Please contact the EuroMed System Administrator in Erbil HQ to reset your password.",
      "warning",
    );
  };

  const togglePassword = useCallback((e) => {
    // منع سحب التركيز (يمنع اختفاء الكيبورد)
    e.preventDefault();
    const input = passwordRef.current;
    if (!input) return;

    // حفظ مكان المؤشر بدقة قبل التغيير
    const start = input.selectionStart;
    const end = input.selectionEnd;
    setShowPassword((prev) => !prev);

    // إعادة التركيز والمؤشر فوراً (بدون setTimeout إذا استخدمت onMouseDown)
    requestAnimationFrame(() => {
      input.setSelectionRange(start, end);
      input.focus();
    });
  }, []);

  return {
    showPassword,
    loginForm,
    setLoginForm,
    errorMessage,
    errors,
    passwordRef,
    isLoading,
    handleChange,
    handleSubmit,
    handleForgotPassword,
    togglePassword,
  };
};

export default useLoginPageLogic;
