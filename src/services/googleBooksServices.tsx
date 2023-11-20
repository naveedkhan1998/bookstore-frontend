import { baseApi } from "./BooksApi";

export const googleBooksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVolumes: builder.query({
      query: (q,maxResult='40') => {
        return {
        url: `volumes?q=${q}&maxResults=${maxResult}`,
          method: "GET",
        };
      },
    }),
    getVolume: builder.query({
      query: (volumeId) => {
        return {
          url: `volumes/${volumeId}`,
          method: "GET",
        };
      },
    }),
    getBookshelves: builder.query({
      query: () => {
        return {
          url: "mylibrary/bookshelves",
          method: "GET",
        };
      },
    }),
    getAnnotations: builder.query({
      query: () => {
        return {
          url: "mylibrary/annotations",
          method: "GET",
        };
      },
    }),
    addVolumeToBookshelf: builder.mutation({
      query: ({ shelf, volumeId }) => {
        return {
          url: `mylibrary/bookshelves/${shelf}/addVolume`,
          method: "POST",
          body: {
            volumeId: volumeId,
          },
        };
      },
    }),
    moveVolumeInBookshelf: builder.mutation({
      query: ({ shelf, volumeId }) => {
        return {
          url: `mylibrary/bookshelves/${shelf}/moveVolume`,
          method: "POST",
          body: {
            volumeId: volumeId,
          },
        };
      },
    }),
    removeVolumeFromBookshelf: builder.mutation({
      query: ({ shelf, volumeId }) => {
        return {
          url: `mylibrary/bookshelves/${shelf}/removeVolume`,
          method: "POST",
          body: {
            volumeId: volumeId,
          },
        };
      },
    }),
  }),
});

export const {
  useGetVolumesQuery,
  useGetVolumeQuery,
  useGetBookshelvesQuery,
  useGetAnnotationsQuery,
  useAddVolumeToBookshelfMutation,
  useMoveVolumeInBookshelfMutation,
  useRemoveVolumeFromBookshelfMutation,
} = googleBooksApi;
