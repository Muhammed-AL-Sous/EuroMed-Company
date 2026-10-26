import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  useGetUserDataQuery,
  useGetCsrfCookieMutation,
} from "../../../auth/authApiSlice";

import {
  selectAuthReady,
  setCredentials,
  logOut,
  setAuthReady,
} from "../../authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  const authReady = useSelector(selectAuthReady);

  // ==================================================
  // Initialize CSRF
  // ==================================================
  const [getCsrfCookie] = useGetCsrfCookieMutation();

  useEffect(() => {
    const hasToken = document.cookie
      .split(";")
      .some((cookie) => cookie.trim().startsWith("XSRF-TOKEN="));

    if (hasToken) return;

    getCsrfCookie()
      .unwrap()
      .catch((error) => {
        console.error("[AuthInitializer] CSRF initialization failed:", error);
      });
  }, [getCsrfCookie]);

  // ==================================================
  // Verify Current Session
  // ==================================================
  const {
    data: userData,
    error: userError,
    isSuccess,
    isError,
    refetch,
  } = useGetUserDataQuery();

  // ==================================================
  // Sync Authentication State
  // ==================================================
  useEffect(() => {
    if (isSuccess) {
      // Supports both transformed and untransformed responses.
      const payload = userData?.data ?? userData;
      const userInfo = payload?.user ?? payload;

      if (userInfo?.id) {
        dispatch(setCredentials({ user: userInfo }));
      } else {
        console.error("[AuthInitializer] Unexpected user response:", payload);

        dispatch(logOut());
      }

      dispatch(setAuthReady(true));
      return;
    }

    if (!isError) return;

    if (userError?.status === 401 || userError?.status === 419) {
      dispatch(logOut());
      dispatch(setAuthReady(true));
      return;
    }

    console.error("[AuthInitializer] Authentication check failed:", userError);
  }, [isSuccess, isError, userData, userError, dispatch]);

  // ==================================================
  // Initial Loading
  // ==================================================
  if (!isSuccess && !isError) {
    return null;
  }

  // Do not treat server/network errors as unauthenticated.
  if (isError && userError?.status !== 401 && userError?.status !== 419) {
    return (
      <div
        role="alert"
        className="flex min-h-screen flex-col items-center justify-center gap-4 p-6"
      >
        <p className="text-sm text-red-700">Unable to verify your session.</p>

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded bg-sky-700 px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!authReady) {
    return null;
  }

  return children;
}
