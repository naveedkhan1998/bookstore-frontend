import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://www.googleapis.com/books/v1/",
});

// Separate slice for Google Books (no auth headers)
export const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery,
  tagTypes: ["Volumes", "Bookshelves"],
  endpoints: () => ({}),
});
