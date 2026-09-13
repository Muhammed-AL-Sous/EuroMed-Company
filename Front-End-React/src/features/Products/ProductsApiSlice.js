import { baseApi } from "../../api/apiSlice";

export const ProductsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubCategories: builder.query({
      query: () => "/getProducts",
      transformResponse: (response) =>
        Array.isArray(response?.data) ? response.data : [],
    }),
  }),
});

export const { useGetProductsQuery } = ProductsApiSlice;
