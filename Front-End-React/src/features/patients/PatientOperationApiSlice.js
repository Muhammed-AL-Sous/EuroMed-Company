import { baseApi } from "../../api/apiSlice";

export const PatientOperationApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyPatientOperation: builder.mutation({
      query: ({ code, date }) => ({
        url: "/patient-operation",
        method: "POST",
        body: {
          code,
          date,
        },
      }),
    }),
  }),
});

export const { useVerifyPatientOperationMutation } = PatientOperationApiSlice;
