import { baseApi } from "../../api/apiSlice";
import { normalizeCategoriesListResponse } from "./CategoriesQueryUtils";

export const CategoriesApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ search = "", page = 1 } = {}) => ({
        url: "/categories",
        params: {
          search: search || undefined,
          page,
        },
      }),

      transformResponse: (response) =>
        normalizeCategoriesListResponse(response),

      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({
                type: "Categories",
                id,
              })),
              {
                type: "Categories",
                id: "category_id",
              },
            ]
          : [
              {
                type: "Categories",
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
        { type: "Categories", id: "category_id" },
      ],
    }),

    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (result, error, arg) => [
        { type: "Categories", id: arg.id },
        { type: "Categories", id: "category_id" },
      ],
    }),

    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, categoryId) => [
        { type: "Categories", id: categoryId },
        { type: "Categories", id: "category_id" },
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
