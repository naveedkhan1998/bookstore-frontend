import { baseApi } from "./baseApi";

export const booklistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooklist: builder.mutation({
      query: ({ booklist, access_token }) => ({
        url: "/booklist/create_booklist",
        method: "POST",
        body: booklist,
        headers: {
          "x-auth-token": `${access_token}`,
        },
      }),
    }),
    editBooklist: builder.mutation({
      query: ({ data, access_token }) => {
        return {
          url: "/booklist/add_books",
          method: "PUT",
          body: data, // data will have the full object we had initially with changes to the books
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
    deleteBooklist: builder.mutation({
      query: ({ id, access_token }) => {
        return {
          url: `/booklist/delete_booklist/${id}`,
          method: "DELETE",
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
    addBookToBooklist: builder.mutation({
      query: ({ data, access_token }) => {
        return {
          url: "/booklist/add_books",
          method: "PUT",
          body: data, // data will have the booklist name and the book id to add
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
    getUserBooklists: builder.query({
      query: (access_token) => {
        return {
          url: "/booklist/user_booklists",
          method: "GET",
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
    getPublicBooklists: builder.query({
      query: () => {
        return {
          url: "/booklist/public_booklists",
          method: "GET",
        };
      },
    }),
    getALLBooklists: builder.query({
      query: (access_token) => {
        return {
          url: "/booklist/authenticated",
          method: "GET",
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
    addBooklistReview: builder.mutation({
      query: ({ body, access_token }) => {
        return {
          url: `/booklist/add_review/${body.booklist_id}`,
          method: "PUT",
          body: { reviewText: body.reviewText },
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useCreateBooklistMutation,
  useEditBooklistMutation,
  useAddBookToBooklistMutation,
  useGetUserBooklistsQuery,
  useGetPublicBooklistsQuery,
  useGetALLBooklistsQuery,
  useDeleteBooklistMutation,
  useAddBooklistReviewMutation,
} = booklistsApi;
