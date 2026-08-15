import { baseApi } from "../../api/apiSlice";

export const ManufacturersApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManufacturers: builder.query({
      query: () => "/manufacturers-brands",
      transformResponse: (response) =>
        Array.isArray(response?.data) ? response.data : [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "Manufacturers", id })),
              { type: "Manufacturers", id: "Manufacturer_id" },
            ]
          : [{ type: "Manufacturers", id: "Manufacturer_id" }],
    }),
  }),
});

export const { useGetManufacturersQuery } = ManufacturersApiSlice;
