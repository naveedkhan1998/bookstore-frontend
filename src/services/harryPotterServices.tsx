import { baseApi } from "./baseApi";

export const harryPotterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getElixirs: builder.query({
      query: () => {
        return {
          url: "Elixirs",
          method: "GET",
        };
      },
    }),
    getHouses: builder.query({
      query: () => {
        return {
          url: "Houses",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetElixirsQuery, useGetHousesQuery } = harryPotterApi;
