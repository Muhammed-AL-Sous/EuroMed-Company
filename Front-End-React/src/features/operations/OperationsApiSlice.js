import { baseApi } from "../../api/apiSlice";
import { normalizeOperationsListResponse } from "./OperationsQueryUtils";

const getOperationsBaseUrl = (scope = "admin") => {
  return scope === "doctor" ? "/doctor/operations" : "/operations";
};

export const OperationsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==================================================
    // Get Operation Form Options
    // ==================================================
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

    // ==================================================
    // Get Operations
    // ==================================================
    getOperations: builder.query({
      query: ({
        search = "",
        page = 1,
        scope = "admin",
        doctor_id = "",
        hospital_id = "",
        operation_type_id = "",
      } = {}) => ({
        url: scope === "doctor" ? "/doctor/operations" : "/operations",

        method: "GET",

        params: {
          search: search || undefined,
          page,
          doctor_id: scope !== "doctor" ? doctor_id || undefined : undefined,
          hospital_id: hospital_id || undefined,
          operation_type_id: operation_type_id || undefined,
        },
      }),

      transformResponse: (response) =>
        normalizeOperationsListResponse(response),

      // احتفظ بـ providesTags الموجود عندك كما هو
    }),

    // ==================================================
    // Get Single Operation
    // ==================================================
    getOperation: builder.query({
      query: (arg) => {
        // Supports both old numeric IDs and new scoped arguments.
        const { id, scope = "admin" } =
          typeof arg === "object" && arg !== null ? arg : { id: arg };

        return {
          url: `${getOperationsBaseUrl(scope)}/${id}`,
          method: "GET",
        };
      },

      transformResponse: (response) => response.data,

      providesTags: (result, error, arg) => {
        const id = typeof arg === "object" && arg !== null ? arg.id : arg;

        return [{ type: "Operations", id }];
      },
    }),

    // ==================================================
    // Create Operation
    // ==================================================
    addOperation: builder.mutation({
      query: (arg) => {
        // Also supports existing addOperation(operationData) calls.
        const isScopedPayload =
          arg !== null &&
          typeof arg === "object" &&
          !(arg instanceof FormData) &&
          Object.hasOwn(arg, "scope") &&
          Object.hasOwn(arg, "data");

        const scope = isScopedPayload ? arg.scope : "admin";
        const data = isScopedPayload ? arg.data : arg;

        return {
          url: getOperationsBaseUrl(scope),
          method: "POST",
          body: data,
        };
      },

      invalidatesTags: [
        {
          type: "Operations",
          id: "LIST",
        },
      ],
    }),

    // ==================================================
    // Update Operation (Admin Only)
    // ==================================================
    updateOperation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/operations/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (result, error, { id }) => [
        { type: "Operations", id },
        { type: "Operations", id: "LIST" },
      ],
    }),

    // ==================================================
    // Delete Operation (Admin Only)
    // ==================================================
    deleteOperation: builder.mutation({
      query: (operationId) => ({
        url: `/operations/${operationId}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, operationId) => [
        { type: "Operations", id: operationId },
        { type: "Operations", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetOperationFormOptionsQuery,
  useLazyGetOperationQuery,
  useGetOperationsQuery,
  useGetOperationQuery,
  useDeleteOperationMutation,
  useAddOperationMutation,
  useUpdateOperationMutation,
} = OperationsApiSlice;
