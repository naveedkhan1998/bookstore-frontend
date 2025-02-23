import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://www.googleapis.com/books/v1/",
  //https://www.googleapis.com/books/v1/volumes?q=all",
  //credentials: "include",
});

// No auto-refresh logic, just the base query
export const baseApi = createApi({
  reducerPath: "booksApi",
  baseQuery,
  endpoints: () => ({}),
});
