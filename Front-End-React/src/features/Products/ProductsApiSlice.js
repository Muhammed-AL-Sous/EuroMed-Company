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
      query: (productData) => ({
        url: "/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Products", id: "PRODUCTS" },
      ],
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (result, error, arg) => [
        { type: "Products", id: arg.id },
        { type: "Products", id: "PRODUCTS" },
      ],
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Products", id: arg.id },
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
