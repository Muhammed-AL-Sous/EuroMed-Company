import { baseApi } from "../../api/apiSlice";
import { normalizePatientsResponse } from "./PatientsQueryUtils";

export const PatientsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: ({ search, page = 1 }) => ({
        url: "/patients",
        params: {
          search: search || undefined,
          page,
        },
      }),
      transformResponse: (response) => normalizePatientsResponse(response),
      providesTags: (result) =>
        result?.patients?.length
          ? [
              ...result.patients.map(({ id }) => ({
                type: "Patients",
                id,
              })),

              {
                type: "Patients",
                id: "Patients_Id",
              },
            ]
          : [
              {
                type: "Patients",
                id: "Patients_Id",
              },
            ],
    }),

    addPatient: builder.mutation({
      query: (PatientData) => ({
        url: "/patients",
        method: "POST",
        body: PatientData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Patients", id: "Patients_Id" },
      ],
    }),

    updatePatient: builder.mutation({
      query: ({ id, data }) => ({
        url: `/patients/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (result, error, arg) => [
        { type: "Patients", id: arg.id },
        { type: "Patients", id: "Patients_Id" },
      ],
    }),

    deletePatient: builder.mutation({
      query: (PatientId) => ({
        url: `/patients/${PatientId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Patients", id: arg.id },
        { type: "Patients", id: "Patients_Id" },
      ],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useDeletePatientMutation,
  useAddPatientMutation,
  useUpdatePatientMutation,
} = PatientsApiSlice;
