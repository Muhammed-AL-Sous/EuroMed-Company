import { baseApi } from "../../api/apiSlice";
import { normalizeOperationsListResponse } from "./OperationsQueryUtils";

export const OperationsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOperationFormOptions: builder.query({
      query: ({ type, search = "" }) => {
        const routes = {
          doctor: "/doctors",
          patient: "/patients",
          hospital: "/hospitals",
          operation_type: "/operation-types",
          product: "/products",
        };

        return {
          url: routes[type],
          method: "GET",
          params: {
            search: search.trim() || undefined,
            page: 1,
          },
        };
      },

      transformResponse: (response) => {
        const rows = response?.data;

        if (Array.isArray(rows)) return rows;
        if (Array.isArray(rows?.data)) return rows.data;

        return [];
      },
    }),

    getOperations: builder.query({
      query: ({ search, page = 1 }) => ({
        url: "/operations",
        params: {
          search: search || undefined,
          page,
        },
      }),
      transformResponse: (response) =>
        normalizeOperationsListResponse(response),
      providesTags: (result) =>
        result?.operations?.length
          ? [
              ...result.operations.map(({ id }) => ({
                type: "Operations",
                id,
              })),

              {
                type: "Operations",
                id: "Operations_Id",
              },
            ]
          : [
              {
                type: "Operations",
                id: "Operations_Id",
              },
            ],
    }),

    getOperation: builder.query({
      query: (id) => ({
        url: `/operations/${id}`,
        method: "GET",
      }),

      transformResponse: (response) => response.data,

      providesTags: (result, error, id) => [{ type: "Operations", id }],
    }),

    addOperation: builder.mutation({
      query: (operationData) => ({
        url: "/operations",
        method: "POST",
        body: operationData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Operations", id: "Operations_Id" },
      ],
    }),

    updateOperation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/operations/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (result, error, arg) => [
        { type: "Operations", id: arg.id },
        { type: "Operations", id: "Operations_Id" },
      ],
    }),

    deleteOperation: builder.mutation({
      query: (operationId) => ({
        url: `/operations/${operationId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Operations", id: arg.id },
        { type: "Operations", id: "Operations_Id" },
      ],
    }),
  }),
});

export const {
  useGetOperationFormOptionsQuery,
  useGetOperationsQuery,
  useLazyGetOperationQuery,
  useDeleteOperationMutation,
  useAddOperationMutation,
  useUpdateOperationMutation,
} = OperationsApiSlice;
