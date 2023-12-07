import { baseApi } from "./baseApi";

export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: (access_token) => {
        return {
          url: "/transaction/",
          method: "GET",
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
    addToTransactions: builder.mutation({
      query: ({ data, access_token }) => {
        return {
          url: "/transaction/",
          method: "POST",
          body: data,
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useAddToTransactionsMutation,
} = transactionsApi;
