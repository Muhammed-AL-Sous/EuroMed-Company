import { baseApi } from "../../api/apiSlice";

export const SubCategoriesApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubCategories: builder.query({
      query: () => "/getSubCategories",
      transformResponse: (response) =>
        Array.isArray(response?.data) ? response.data : [],
    }),
    getProductsBySubCategory: builder.query({
      query: (subCategoryId) => `/getProductsBySubCategory/${subCategoryId}`,
      transformResponse: (response) =>
        Array.isArray(response?.data) ? response.data : [],
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "SubCategories", id })),
              { type: "SubCategories", id: "Sub_Categories" },
            ]
          : [{ type: "SubCategories", id: "Sub_Categories" }],
    }),
  }),
});

export const { useGetProductsBySubCategoryQuery, useGetSubCategoriesQuery } =
  SubCategoriesApiSlice;
