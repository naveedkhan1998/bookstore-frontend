import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { RootState } from "../app/store";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://bookstore-backend-ahmed-begreatorco.vercel.app",
  //baseUrl: "http://localhost:3001",
  //credentials: "include",
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  endpoints: (builder) => ({}),
});
