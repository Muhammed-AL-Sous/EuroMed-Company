import { baseApi } from "../../api/apiSlice";
import { normalizeProductsListResponse } from "./ProductsQueryUtils";

export const ProductsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ subcategory_id, search, manufacturer_id, page = 1 }) => ({
        url: "/products",
        params: {
          subcategory_id: subcategory_id || undefined,
          search: search || undefined,
          manufacturer_id: manufacturer_id || undefined,
          page,
        },
      }),

      transformResponse: (response) => normalizeProductsListResponse(response),

      providesTags: (result) =>
        result?.products?.length
          ? [
              ...result.products.map(({ id }) => ({
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
