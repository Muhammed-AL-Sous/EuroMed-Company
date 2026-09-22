import { baseApi } from "../../api/apiSlice";
import { logOut } from "./authSlice";

// دالة مساعدة لجلب CSRF cookie
async function fetchCsrfCookie() {
  try {
    const response = await fetch("/sanctum/csrf-cookie", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Failed to Fetch CSRF Cookie : ", error);
    throw error;
  }
}

// ⭐ إضافة endpoints للـ baseApi
export const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** جلب cookie الـ CSRF من Laravel Sanctum (يُستخدم من AuthInitializer والنماذج عند الحاجة) */
    getCsrfCookie: builder.mutation({
      queryFn: async () => {
        try {
          await fetchCsrfCookie();
          return { data: { success: true } };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: error.message } };
        }
      },
    }),

    // ✅ جلب بيانات المستخدم الحالي
    getUserData: builder.query({
      query: () => ({
        url: "/users/currentUser",
        method: "GET",
      }),
      // عندك query مثل `getUserData` مع `providesTags: ["User"]` — يعني “هذه النتيجة **تمثل** حالة المستخدم”.
      providesTags: ["User"],
      // إعداد خاص للتعامل مع أخطاء 401/419
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          data: response.data,
          error: response.data?.message || "خطأ في جلب بيانات المستخدم",
        };
      },
    }),

    // ✅ تسجيل الدخول
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      // عندك mutation مثل `login` مع `invalidatesTags: ["User"]` — يعني “بعد النجاح، **ما عاد** نعتمد النسخة القديمة من بيانات المستخدم؛ أعد التزامن”.
      invalidatesTags: ["User"],
    }),

    // ============ verify Email Api Mutation ============ //
    verifyEmail: builder.mutation({
      query: (credentials) => ({
        url: "/verify-email",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // ============ Resend Verification Api Mutation ============ //
    resendVerification: builder.mutation({
      query: (body) => ({
        url: "/resend-code",
        method: "POST",
        body, // { email }
      }),
    }),

    // ============ Forgot Password Api Mutation ============ //
    forgotPassword: builder.mutation({
      query: (emailOrPayload) => ({
        url: "/forgot-password",
        method: "POST",
        body:
          typeof emailOrPayload === "string"
            ? { email: emailOrPayload }
            : emailOrPayload,
      }),
    }),

    // ============ Reset Password Api Mutation ============ //
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: {
          token: data.token,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        },
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ تسجيل حساب جديد
    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ تسجيل الخروج
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      // لا نستخدم invalidatesTags: قد يعيد استدعاء getUserData قبل المسح
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          dispatch(baseApi.util.resetApiState());
          document.cookie =
            "fast_check=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
  }),
  // ⭐ هذا مهم لضمان override الـ existing endpoints
  overrideExisting: false,
});

// ✅ تصدير جميع الـ hooks بالأسماء الصحيحة
export const {
  useGetCsrfCookieMutation,
  useGetUserDataQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApiSlice;

// ✅ تصدير الـ slice نفسه (قد نحتاجه)
export default authApiSlice;
