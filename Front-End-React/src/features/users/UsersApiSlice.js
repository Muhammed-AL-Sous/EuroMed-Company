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
              type: "User",
              id,
            }))
          : []),

        {
          type: "User",
          id: "LIST",
        },
      ],
    }),

    // ==================================================
    // Current User
    // ==================================================
    getCurrentUser: builder.query({
      query: () => ({
        url: "/users/currentUser",
        method: "GET",
      }),

      transformResponse: (response) => response.data,

      providesTags: (result) =>
        result ? [{ type: "User", id: result.id }] : ["User"],
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

      invalidatesTags: (result, error) =>
        error ? [] : [{ type: "User", id: "LIST" }],
    }),

    // ==================================================
    // Update User
    // ==================================================
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (result, error, { id }) =>
        error
          ? []
          : [
              { type: "User", id },
              { type: "User", id: "LIST" },
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

      invalidatesTags: (result, error, userId) =>
        error
          ? []
          : [
              { type: "User", id: userId },
              { type: "User", id: "LIST" },
            ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetCurrentUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = UsersApiSlice;
