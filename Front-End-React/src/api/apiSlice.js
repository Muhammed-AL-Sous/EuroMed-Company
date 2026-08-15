import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function getCsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
  prepareHeaders: (headers) => {
    const csrfToken = getCsrfToken();
    if (csrfToken) headers.set("X-XSRF-TOKEN", csrfToken);
    headers.set("Accept", "application/json");
    headers.set("X-Requested-With", "XMLHttpRequest");
    return headers;
  },
});

const baseQueryWith419Handler = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 419) {
    await fetch("/sanctum/csrf-cookie", {
      credentials: "include",
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });
    result = await rawBaseQuery(args, api, extraOptions);
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWith419Handler,
  tagTypes: [
    "User",
    "Auth",
    "Doctors",
    "Lookup",
    "Stats",
    "Categories",
    "OperationTypes",
    "Manufacturers",
  ],
  endpoints: () => ({}),
});
