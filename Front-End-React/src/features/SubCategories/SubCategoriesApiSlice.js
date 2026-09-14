import { baseApi } from "../../api/apiSlice";

export const SubCategoriesApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubCategories: builder.query({
      query: () => "/subcategories",
      transformResponse: (response) =>
        Array.isArray(response?.data) ? response.data : [],
    }),
  }),
});

export const { useGetSubCategoriesQuery } = SubCategoriesApiSlice;
