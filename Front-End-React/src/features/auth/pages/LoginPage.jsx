import { AlertCircle, Eye, EyeOff, KeyRound, Lock, Mail } from "lucide-react";
// ========= React ========= //
import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";

// ========= Redux ========= //
import { useDispatch } from "react-redux";

// ========= Login Slice ========= //
import { useLoginMutation } from "../authApiSlice";
import { setCredentials } from "../authSlice";
import { notifySonner } from "./../../../lib/notifySonner";
import { Spinner } from "../../../components/common/SpinnerFallback";

const LoginPage = () => {
  // ========= React State ========= //
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errorMessage, setErrorMessage] = useState("");

  // ========= Refs ========= //
  const passwordRef = useRef(null);

  // ========= Router ========= //
  const navigate = useNavigate();

  // ========= Redux ========= //
  const dispatch = useDispatch();

  // ========= API Mutation ========= //
  const [login, { isLoading }] = useLoginMutation();

  // ========= Handle Submit Function ========= //
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const loginPromise = login(loginForm).unwrap();

      const response = await loginPromise;

      const { user } = response.data;

      dispatch(setCredentials({ user }));

      if (response.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (response.user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/staff/dashboard");
      }

      notifySonner("welcome back", "success");
    } catch (err) {
      setErrorMessage(
        err?.data?.message || "Login failed. Please check your credentials.",
      );

      const status = err.status;
      // معالجة الـ 401 (بيانات خاطئة)
      if (status === 401) {
        notifySonner("Invalid Email Or Password", "error");
        return;
      }
      notifySonner("Login Failed", "error");
    }
  };

  // =============================
  // Toggle Password (Professional Fix)
  // =============================
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

  return (
    <div className=" bg-slate-100 flex items-start justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full space-y-12 bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-1/2 mx-auto mt-0 object-cover mb-3">
            <img src="/images/EuroMed-Logo-layout.png" alt="EuroMed-Logo" />
          </div>
          <p className="text-sm text-slate-400 font-semibold">
            Authorized System Access for Administrators, Surgeons & Staff
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                value={loginForm.email}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setLoginForm((prev) => ({ ...prev, [name]: value }));
                }}
                autoComplete="email"
                placeholder="user@euromed.iq"
                className="w-full bg-slate-50 text-slate-900 pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-0 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() =>
                  notifySonner(
                    "Please contact the EuroMed System Administrator in Erbil HQ to reset your password.",
                    "warning",
                  )
                }
                className="text-xs font-semibold text-sky-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                ref={passwordRef}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                inputMode="text"
                style={{
                  letterSpacing:
                    !showPassword && loginForm.password.length > 0
                      ? "0.2em"
                      : "normal",
                }}
                value={loginForm.password}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setLoginForm((prev) => ({ ...prev, [name]: value }));
                }}
                placeholder="••••••••"
                className="w-full outline-0 bg-slate-50 text-slate-900 pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 text-sm font-medium"
              />
              {/* ======= Icon Show Hide Password ======= */}
              <button
                type="button"
                onMouseDown={togglePassword}
                className="absolute top-1/2 -translate-y-1/2 right-4"
                style={{
                  cursor: "pointer",
                  zIndex: 10,
                  color: "#6c757d",
                  fontSize: "18px",
                }}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          {/* ============= Remember Me Smooth Switch ============= */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="remember"
              className="text-md font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Remember Me
            </label>

            <button
              type="button"
              role="switch"
              id="remember"
              aria-checked={loginForm.remember}
              onClick={() =>
                setLoginForm({ ...loginForm, remember: !loginForm.remember })
              }
              className={`
      relative w-14 h-7 rounded-full
      transition-colors duration-300 ease-out cursor-pointer
      ${
        loginForm.remember
          ? "bg-sky-500 shadow-lg shadow-red-500/30"
          : "bg-slate-300 dark:bg-gray-400"
      }
    `}
            >
              <span
                className={`
        absolute top-1
        h-5 w-5 rounded-full bg-white shadow-md
        transition-transform duration-300 ease-out right-1
        ${loginForm.remember ? "-translate-x-7" : "translate-x-0"}
      `}
              />
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer py-3.5 px-6 rounded-xl hover:bg-sky-600 bg-sky-500 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Spinner size="sm" variant="onPrimary" />
              </span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>login</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
