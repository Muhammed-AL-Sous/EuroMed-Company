import { baseApi } from "../../api/apiSlice";

export const DashboardApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query({
      query: () => ({
        url: "/dashboard/overview",
        method: "GET",
      }),

      transformResponse: (response) => response?.data ?? null,
    }),
  }),
});

export const { useGetDashboardOverviewQuery } = DashboardApiSlice;
