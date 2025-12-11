import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://bookstore-backend-ahmed-begreatorco.vercel.app",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as { auth?: { access?: string | null } };
    const token = state.auth?.access;

    if (token && !headers.has("x-auth-token")) {
      headers.set("x-auth-token", token);
    }

    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  tagTypes: [
    "Auth",
    "User",
    "Books",
    "Booklists",
    "Cart",
    "Orders",
    "Reviews",
  ],
  endpoints: () => ({}),
});
