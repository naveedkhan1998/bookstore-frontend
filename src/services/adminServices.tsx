import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminGetUsers: builder.query({
      query: (access_token) => {
        return {
          url: "/admin/get_users",
          method: "GET",
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
    adminDisableUser: builder.mutation({
      query: ({ user_id, access_token }) => {
        return {
          url: `/admin/toggle_active/${user_id}`,
          method: "PUT",
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
    adminHideReview: builder.mutation({
      query: ({ booklist_id, review_id, access_token }) => {
        return {
          url: `/admin/toggle_review_visibility/${booklist_id}/${review_id}`,
          method: "PUT",
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
    adminMakeAdmin: builder.mutation({
      query: ({ user_id, access_token }) => {
        return {
          url: `/admin/toggle_admin/${user_id}`,
          method: "PUT",
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useAdminDisableUserMutation,
  useAdminGetUsersQuery,
  useAdminHideReviewMutation,
  useAdminMakeAdminMutation,
} = adminApi;
