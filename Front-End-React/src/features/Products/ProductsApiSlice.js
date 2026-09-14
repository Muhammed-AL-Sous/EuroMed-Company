import { baseApi } from "../../api/apiSlice";

export const ProductsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ subcategory_id, search }) => ({
        url: "/products",
        params: {
          subcategory_id,
          search,
        },
      }),

      transformResponse: (response) =>
        Array.isArray(response?.data) ? response.data : [],

      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({
                type: "Products",
                id,
              })),
              {
                type: "Products",
                id: "PRODUCTS",
              },
            ]
          : [
              {
                type: "Products",
                id: "PRODUCTS",
              },
            ],
    }),
  }),
});

export const { useGetProductsQuery } = ProductsApiSlice;
