import { baseApi } from "../../api/apiSlice";
import { normalizeHospitalsListResponse } from "./HospitalsQueryUtils";

export const HospitalsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHospitals: builder.query({
      query: ({ search, page = 1 }) => ({
        url: "/hospitals",
        params: {
          search: search || undefined,
          page,
        },
      }),
      transformResponse: (response) => normalizeHospitalsListResponse(response),
      providesTags: (result) =>
        result?.hospitals?.length
          ? [
              ...result.hospitals.map(({ id }) => ({
                type: "Hospitals",
                id,
              })),

              {
                type: "Hospitals",
                id: "Hospitals_Id",
              },
            ]
          : [
              {
                type: "Hospitals",
                id: "Hospitals_Id",
              },
            ],
    }),
  }),
});

export const { useGetHospitalsQuery } = HospitalsApiSlice;
