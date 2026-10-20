import { baseApi } from "../../api/apiSlice";
import { normalizeDoctorsListResponse } from "./DoctorsQueryUtils";

export const DoctorsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query({
      query: ({ search, page = 1 }) => ({
        url: "/doctors",
        params: {
          search: search || undefined,
          page,
        },
      }),
      transformResponse: (response) => normalizeDoctorsListResponse(response),
      providesTags: (result) =>
        result?.doctors?.length
          ? [
              ...result.doctors.map(({ id }) => ({
                type: "Doctors",
                id,
              })),

              {
                type: "Doctors",
                id: "Doctors_Id",
              },
            ]
          : [
              {
                type: "Doctors",
                id: "Doctors_Id",
              },
            ],
    }),

    addDoctor: builder.mutation({
      query: (doctorsData) => ({
        url: "/doctors",
        method: "POST",
        body: doctorsData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Doctors", id: "Doctors_Id" },
      ],
    }),

    updateDoctor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/doctors/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (result, error, arg) => [
        { type: "Doctors", id: arg.id },
        { type: "Doctors", id: "Doctors_Id" },
      ],
    }),

    deleteDoctor: builder.mutation({
      query: (doctorId) => ({
        url: `/doctors/${doctorId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Doctors", id: arg.id },
        { type: "Doctors", id: "Doctors_Id" },
      ],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useDeleteDoctorMutation,
  useAddDoctorMutation,
  useUpdateDoctorMutation,
} = DoctorsApiSlice;
