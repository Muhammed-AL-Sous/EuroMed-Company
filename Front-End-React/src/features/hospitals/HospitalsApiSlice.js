import { baseApi } from "../../api/apiSlice";

export const HospitalsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHospitals: builder.query({
      query: () => "/hospitals",
      transformResponse: (response) =>
        Array.isArray(response?.data) ? response.data : [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "Hospitals", id })),
              { type: "Hospitals", id: "Hospital_id" },
            ]
          : [{ type: "Hospitals", id: "Hospital_id" }],
    }),
  }),
});

export const { useGetHospitalsQuery } = HospitalsApiSlice;
