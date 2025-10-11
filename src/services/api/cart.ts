import { baseApi } from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: (access_token) => {
        return {
          url: "/cart/",
          method: "GET",
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
    addToCart: builder.mutation({
      query: ({ book_id, access_token }) => {
        return {
          url: "/cart/add_book",
          method: "POST",
          body: book_id,
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
    removeFromCart: builder.mutation({
      query: ({ book_id, access_token }) => {
        return {
          url: "/cart/decrement_book",
          method: "PUT",
          body: book_id,
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
    removeWholeItemFromCart: builder.mutation({
      query: ({ book_id, access_token }) => {
        return {
          url: "/cart/remove_book",
          method: "PUT",
          body: book_id,
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useRemoveWholeItemFromCartMutation,
} = cartApi;
