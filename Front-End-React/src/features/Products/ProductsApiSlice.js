import { baseApi } from "../../api/apiSlice";
import { normalizeProductsListResponse } from "./ProductsQueryUtils";

export const ProductsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({
        subcategory_id,
        search,
        manufacturer_id,
        page = 1,
        category_id,
      }) => ({
        url: "/products",
        params: {
          subcategory_id: subcategory_id || undefined,
          search: search || undefined,
          manufacturer_id: manufacturer_id || undefined,
          page,
          category_id: category_id || undefined,
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

    addProduct: builder.mutation({
      query: (formData) => ({
        url: "/products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: () => [{ type: "Products", id: "PRODUCTS" }],
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: (...[, , { id }]) => [
        { type: "Products", id },
        { type: "Products", id: "PRODUCTS" },
      ],
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: (...[, , productId]) => [
        { type: "Products", id: productId },
        { type: "Products", id: "PRODUCTS" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = ProductsApiSlice;
