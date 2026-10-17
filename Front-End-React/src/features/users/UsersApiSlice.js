import { baseApi } from "../../api/apiSlice";
import { normalizeUsersListResponse } from "./UsersQueryUtils";

export const UsersApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ search = "", page = 1 } = {}) => ({
        url: "/users",
        params: {
          search: search || undefined,
          page,
        },
      }),

      transformResponse: (response) => normalizeUsersListResponse(response),

      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({
                type: "Users",
                id,
              })),
              {
                type: "Users",
                id: "user_id",
              },
            ]
          : [
              {
                type: "Users",
                id: "user_id",
              },
            ],
    }),

    createUser: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: (result, error, arg) => [
        { type: "Users", id: arg.id },
        { type: "Users", id: "user_id" },
      ],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Users", id: arg.id },
        { type: "Users", id: "user_id" },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = UsersApiSlice;
