import { useDispatch, useSelector } from "react-redux";
import { useEffect, useLayoutEffect, useMemo } from "react";
import {
  useGetUserDataQuery,
  useGetCsrfCookieMutation,
} from "../../../auth/authApiSlice";
import {
  selectCurrentUser,
  selectAuthReady,
  setCredentials,
  logOut,
  setAuthReady,
} from "../../authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  // فحص وجود fast_check cookie
  const hasFastCheck = useMemo(() => {
    return document.cookie
      .split(";")
      .some((item) => item.trim().startsWith("fast_check="));
  }, []);

  // فحص وجود XSRF-TOKEN
  const hasXSRFToken = useMemo(() => {
    return document.cookie
      .split(";")
      .some((item) => item.trim().startsWith("XSRF-TOKEN="));
  }, []);

  const [
    getCsrfCookie,
    {
      isLoading: isCsrfLoading,
      isSuccess: isCsrfSuccess,
      isError: isCsrfError,
      error: csrfError,
    },
  ] = useGetCsrfCookieMutation();

  // تحديد ما إذا كان CSRF جاهز
  const csrfReady = useMemo(() => {
    if (user) return true; // إذا كان هناك مستخدم، فالـ CSRF جاهز
    if (hasXSRFToken) return true; // إذا كان XSRF token موجود
    if (isCsrfSuccess || isCsrfError) return true; // إذا انتهى طلب CSRF
    return false;
  }, [user, hasXSRFToken, isCsrfSuccess, isCsrfError]);

  // جلب CSRF token عند الحاجة
  useEffect(() => {
    // لا نحتاج CSRF إذا كان المستخدم مسجل دخول بالفعل
    if (user) return;

    // لا نحتاج CSRF إذا كان موجود بالفعل
    if (hasXSRFToken) return;

    // لا نعيد المحاولة إذا تم بالفعل
    if (isCsrfSuccess || isCsrfError) return;

    getCsrfCookie()
      .unwrap()
      .catch((error) => {
        console.warn("❌ CSRF token fetch failed:", error);
      });
  }, [user, hasXSRFToken, isCsrfSuccess, isCsrfError, getCsrfCookie]);

  // إعدادات استعلام بيانات المستخدم
  const skipUserData = !!user || !csrfReady;

  // ✅ استعلام بيانات المستخدم
  const {
    data: userData,
    error: userError,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
    isUninitialized: isUserUninitialized,
  } = useGetUserDataQuery(undefined, {
    skip: skipUserData,
    retryOnMountWithNoData: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // معالجة استجابة بيانات المستخدم
  useEffect(() => {
    const userInfo = userData?.data?.user;
    if (userInfo) {
      dispatch(setCredentials({ user: userInfo }));

      // إضافة fast_check cookie للمرات القادمة
      document.cookie = "fast_check=1; path=/; SameSite=Lax; max-age=2592000"; // 30 يوم
    }
  }, [userData, dispatch]);

  // معالجة أخطاء بيانات المستخدم
  useEffect(() => {
    if (userError) {
      if (userError.status === 401 || userError.status === 419) {
        // مستخدم غير مصرح له - مسح الكوكيز وتسجيل الخروج
        document.cookie =
          "fast_check=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
        dispatch(logOut());
      } else {
        // خطأ آخر - اعرضه في console فقط
        console.warn("[AuthInitializer] getUserData failed:", userError);
      }
    }
  }, [userError, dispatch]);

  // معالجة أخطاء CSRF
  useEffect(() => {
    if (csrfError) {
      console.warn("[AuthInitializer] CSRF fetch failed:", csrfError);
    }
  }, [csrfError]);

  // تحديد حالة التحميل
  const isUserDataLoading =
    !user &&
    !userData &&
    !userError &&
    (isUserLoading || isUserFetching || isUserUninitialized);

  const isAuthLoading =
    (hasFastCheck && !csrfReady) || isCsrfLoading || isUserDataLoading;

  // إشعار Redux أن Auth جاهز
  const authReady = useSelector(selectAuthReady);

  useLayoutEffect(() => {
    if (!isAuthLoading && !authReady) {
      dispatch(setAuthReady(true));
    }
  }, [isAuthLoading, authReady, dispatch]);

  const authBlocking = isAuthLoading || !authReady;

  if (authBlocking) {
    return null;
  }

  return children;
}
