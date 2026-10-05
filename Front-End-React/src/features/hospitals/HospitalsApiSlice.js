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
      query: ({ hospitalId, ...hospitalData }) => ({
        url: `/hospitals/${hospitalId}`,
        method: "PUT",
        body: hospitalData,
      }),
      invalidatesTags: (result, error, arg) => {
        const hospitalId = arg?.hospitalId ? arg.hospitalId : arg;
        return [
          { type: "Hospitals", id: hospitalId },
          { type: "Hospitals", id: "Hospitals_Id" },
        ];
      },
    }),

    deleteHospital: builder.mutation({
      query: (hospitalId) => ({
        url: `/hospitals/${hospitalId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, hospitalId) => [
        { type: "Hospitals", id: hospitalId },
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
