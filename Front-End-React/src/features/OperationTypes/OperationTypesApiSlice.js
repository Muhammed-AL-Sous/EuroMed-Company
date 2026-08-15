import { baseApi } from "../../api/apiSlice";

export const OperationTypesApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOperationTypes: builder.query({
      query: () => "/operationTypes",
      transformResponse: (response) =>
        Array.isArray(response?.data) ? response.data : [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "OperationTypes", id })),
              { type: "OperationTypes", id: "Operation_Types" },
            ]
          : [{ type: "OperationTypes", id: "Operation_Types" }],
    }),
  }),
});

export const { useGetOperationTypesQuery } = OperationTypesApiSlice;
