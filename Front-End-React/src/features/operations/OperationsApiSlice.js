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
        url: getOperationsBaseUrl(scope),
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

      providesTags: (result) => {
        const rows = Array.isArray(result?.operations)
          ? result.operations
          : Array.isArray(result?.data)
            ? result.data
            : [];

        return [
          ...rows.map(({ id }) => ({ type: "Operations", id })),
          { type: "Operations", id: "LIST" },
        ];
      },
    }),

    // ==================================================
    // Get Single Operation
    // ==================================================
    getOperation: builder.query({
      query: (arg) => {
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

      invalidatesTags: [{ type: "Operations", id: "LIST" }],
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

    // ==================================================
    // Download Excel Import Template (Admin / Staff)
    // A mutation is used so the GET request only runs when clicked.
    // ==================================================

    downloadOperationsTemplate: builder.mutation({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: "/operations/import-template",
          method: "GET",

          responseHandler: async (response) => {
            const contentType =
              response.headers.get("content-type")?.toLowerCase() ?? "";

            if (!response.ok || contentType.includes("json")) {
              const text = await response.text();

              try {
                return JSON.parse(text);
              } catch {
                return {
                  message: text.trim() || "Failed to download template",
                };
              }
            }

            return response.blob();
          },
        });

        if (result.error) {
          return { error: result.error };
        }

        const blob = result.data;

        if (!(blob instanceof Blob) || blob.size === 0) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Invalid Excel file",
              data: {
                message: "Server did not return a valid Excel file.",
              },
            },
          };
        }

        try {
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");

          link.href = url;
          link.download = "EuroMed_Operations_Template.xlsx";

          document.body.appendChild(link);
          link.click();
          link.remove();

          window.setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 1000);

          // Return only serializable data to Redux
          return {
            data: {
              success: true,
              message: "Excel template downloaded successfully",
            },
          };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: String(error),
              data: {
                message: "Failed to save Excel template",
              },
            },
          };
        }
      },
    }),

    // ==================================================
    // Import Excel Operations (Admin / Staff)
    // ==================================================
    importOperations: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/operations/import",
          method: "POST",
          body: formData,
          // Do not set Content-Type: browser supplies multipart boundary.
        };
      },

      invalidatesTags: (result, error) =>
        error ? [] : [{ type: "Operations", id: "LIST" }],
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
  useDownloadOperationsTemplateMutation,
  useImportOperationsMutation,
} = OperationsApiSlice;
