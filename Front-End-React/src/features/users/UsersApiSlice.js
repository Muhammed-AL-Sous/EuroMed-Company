import { baseApi } from "../../api/apiSlice";
import { normalizeUsersListResponse } from "./UsersQueryUtils";

export const UsersApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==================================================
    // Get Users
    // ==================================================

    getUsers: builder.query({
      query: ({ search = "", page = 1 } = {}) => ({
        url: "/users",
        method: "GET",
        params: {
          search: search || undefined,
          page,
        },
      }),

      transformResponse: (response) => normalizeUsersListResponse(response),

      providesTags: (result) => [
        ...(Array.isArray(result?.users)
          ? result.users.map(({ id }) => ({
              type: "Users",
              id,
            }))
          : []),

        {
          type: "Users",
          id: "LIST",
        },
      ],
    }),

    // ==================================================
    // Create User
    // ==================================================

    createUser: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [
        {
          type: "Users",
          id: "LIST",
        },
      ],
    }),

    // ==================================================
    // Update User
    // ==================================================

    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (result, error, { id }) => [
        {
          type: "Users",
          id,
        },
        {
          type: "Users",
          id: "LIST",
        },
      ],
    }),

    // ==================================================
    // Delete User
    // ==================================================

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, userId) => [
        {
          type: "Users",
          id: userId,
        },
        {
          type: "Users",
          id: "LIST",
        },
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
