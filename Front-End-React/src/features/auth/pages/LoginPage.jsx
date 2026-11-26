import { AlertCircle, Eye, EyeOff, KeyRound, Lock, User } from "lucide-react";
import { Spinner } from "../../../components/common/SpinnerFallback";
import useLoginPageLogic from "./useLoginPageLogic.js";

const LoginPage = () => {
  const {
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
  } = useLoginPageLogic();

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
          <div className="mb-7">
            <label className="block text-xs font-bold text-slate-700 tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="username"
                value={loginForm.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder="Enter Your Username"
                className={`w-full bg-slate-50 text-slate-900 pl-11 pr-4 py-3 rounded-xl border outline-0 text-sm font-medium
        ${
          errors.username
            ? "border-red-500 focus:border-red-500"
            : "border-slate-200 focus:border-sky-500"
        }`}
              />
              {/* ======= Errors Username ======= */}
              {errors.username && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] w-full">
                  <p className="text-red-500 text-xs font-semibold px-1">
                    {errors.username}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-7">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-semibold text-sky-600 hover:underline outline-none"
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
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full bg-slate-50 text-slate-900 pl-11 pr-4 py-3 rounded-xl border outline-0 text-sm font-medium
        ${
          errors.password
            ? "border-red-500 focus:border-red-500"
            : "border-slate-200 focus:border-sky-500"
        }`}
              />
              {/* ======= Errors password ======= */}
              {errors.password && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] w-full">
                  <p className="text-red-500 text-xs font-semibold px-1">
                    {errors.password}
                  </p>
                </div>
              )}
              {/* ======= Icon Show Hide Password ======= */}
              <button
                type="button"
                onMouseDown={togglePassword}
                className="absolute top-1/2 -translate-y-1/2 right-4 outline-none"
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
              className="text-md font-extrabold text-slate-600 cursor-pointer outline-none"
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
      transition-colors duration-300 ease-out cursor-pointer outline-none
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
            className="w-full cursor-pointer py-3.5 px-6 outline-none rounded-xl hover:bg-sky-600 bg-sky-500 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center outline-none">
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
