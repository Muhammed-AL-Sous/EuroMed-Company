import { baseApi } from "../../api/apiSlice";

export const CategoriesApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/categories",
      
      transformResponse: (response) =>
        Array.isArray(response?.data) ? response.data : [],

      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({
                type: "categories",
                id,
              })),
              {
                type: "categories",
                id: "category_id",
              },
            ]
          : [
              {
                type: "categories",
                id: "category_id",
              },
            ],
    }),
  }),
});

export const { useGetCategoriesQuery } = CategoriesApiSlice;
