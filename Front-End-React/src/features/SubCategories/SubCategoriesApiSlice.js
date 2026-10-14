import { baseApi } from "../../api/apiSlice";
import { normalizeSubCategoriesListResponse } from "./SubCategoriesQueryUtils";

export const SubCategoriesApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubCategories: builder.query({
      query: ({ search = "", page = 1 } = {}) => ({
        url: "/subcategories",
        params: {
          search: search || undefined,
          page,
        },
      }),

      transformResponse: (response) =>
        normalizeSubCategoriesListResponse(response),

      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({
                type: "SubCategories",
                id,
              })),
              {
                type: "SubCategories",
                id: "subcategory_id",
              },
            ]
          : [
              {
                type: "SubCategories",
                id: "subcategory_id",
              },
            ],
    }),

    addSubCategory: builder.mutation({
      query: (formData) => ({
        url: "/subcategories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "SubCategories", id: "subcategory_id" },
      ],
    }),

    updateSubCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/subcategories/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (result, error, arg) => [
        { type: "SubCategories", id: arg.id },
        { type: "SubCategories", id: "subcategory_id" },
      ],
    }),

    deleteSubCategory: builder.mutation({
      query: (subcategory_id) => ({
        url: `/subcategories/${subcategory_id}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, subcategory_id) => [
        { type: "SubCategories", id: subcategory_id },
        { type: "SubCategories", id: "subcategory_id" },
      ],
    }),
  }),
});

export const {
  useGetSubCategoriesQuery,
  useAddSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = SubCategoriesApiSlice;
