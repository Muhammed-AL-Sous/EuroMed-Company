import { baseApi } from "../../api/apiSlice";
import { normalizeCategoriesListResponse } from "./CategoriesQueryUtils";

export const CategoriesApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/categories",

      transformResponse: (response) =>
        normalizeCategoriesListResponse(response),

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
    addCategory: builder.mutation({
      query: (categoryData) => ({
        url: "/categories",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "categories", id: "category_id" },
      ],
    }),

    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (result, error, arg) => [
        { type: "categories", id: arg.id },
        { type: "categories", id: "category_id" },
      ],
    }),

    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "categories", id: arg.id },
        { type: "categories", id: "category_id" },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = CategoriesApiSlice;
