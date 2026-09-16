import { baseApi } from "../../api/apiSlice";

export const SubCategoriesApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubCategories: builder.query({
      query: () => "/subcategories",
      
      transformResponse: (response) =>
        Array.isArray(response?.data) ? response.data : [],

      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({
                type: "subcategories",
                id,
              })),
              {
                type: "subcategories",
                id: "subcategory_id",
              },
            ]
          : [
              {
                type: "subcategories",
                id: "subcategory_id",
              },
            ],
    }),
  }),
});

export const { useGetSubCategoriesQuery } = SubCategoriesApiSlice;
