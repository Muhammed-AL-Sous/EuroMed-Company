import { baseApi } from "../../api/apiSlice";
import { normalizeManufacturersListResponse } from "./ManufacturersQueryUtils";

export const ManufacturersApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManufacturers: builder.query({
      query: ({ search = "", page = 1 } = {}) => ({
        url: "/manufacturers",
        params: {
          search: search || undefined,
          page,
        },
      }),

      transformResponse: (response) =>
        normalizeManufacturersListResponse(response),

      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({
                type: "Manufacturers",
                id,
              })),
              {
                type: "Manufacturers",
                id: "manufacturer_id",
              },
            ]
          : [
              {
                type: "Manufacturers",
                id: "manufacturer_id",
              },
            ],
    }),

    addManufacturer: builder.mutation({
      query: (manufacturerData) => ({
        url: "/manufacturers",
        method: "POST",
        body: manufacturerData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Manufacturers", id: "manufacturer_id" },
      ],
    }),

    updateManufacturer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/manufacturers/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (result, error, arg) => [
        { type: "Manufacturers", id: arg.id },
        { type: "Manufacturers", id: "manufacturer_id" },
      ],
    }),

    deleteManufacturer: builder.mutation({
      query: (manufacturer_id) => ({
        url: `/manufacturers/${manufacturer_id}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, manufacturer_id) => [
        { type: "Manufacturers", id: manufacturer_id },
        { type: "Manufacturers", id: "manufacturer_id" },
      ],
    }),
  }),
});

export const {
  useGetManufacturersQuery,
  useAddManufacturerMutation,
  useUpdateManufacturerMutation,
  useDeleteManufacturerMutation,
} = ManufacturersApiSlice;
