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

    addHospital: builder.mutation({
      query: (hospitalData) => ({
        url: "/hospitals",
        method: "POST",
        body: hospitalData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Hospitals", id: "Hospitals_Id" },
      ],
    }),

    updateHospital: builder.mutation({
      query: ({ id, data }) => ({
        url: `/hospitals/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (result, error, arg) => [
        { type: "Hospitals", id: arg.id },
        { type: "Hospitals", id: "Hospitals_Id" },
      ],
    }),

    deleteHospital: builder.mutation({
      query: (hospitalId) => ({
        url: `/hospitals/${hospitalId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Hospitals", id: arg.id },
        { type: "Hospitals", id: "Hospitals_Id" },
      ],
    }),
  }),
});

export const {
  useGetHospitalsQuery,
  useDeleteHospitalMutation,
  useAddHospitalMutation,
  useUpdateHospitalMutation,
} = HospitalsApiSlice;
