import { booksApi } from "./booksApi";

type GetVolumesArgs = {
  q: string;
  maxResults?: string | number;
};

export const googleBooksApi = booksApi.injectEndpoints({
  endpoints: (builder) => ({
    getVolumes: builder.query({
      query: ({ q, maxResults = "40" }: GetVolumesArgs) => ({
        url: `volumes?q=${encodeURIComponent(q)}&maxResults=${maxResults}`,
        method: "GET",
      }),
      providesTags: ["Volumes"],
    }),
    getVolume: builder.query({
      query: (volumeId: string) => ({
        url: `volumes/${volumeId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, volumeId) => [
        { type: "Volumes", id: volumeId },
      ],
    }),
    getBookshelves: builder.query({
      query: () => ({
        url: "mylibrary/bookshelves",
        method: "GET",
      }),
      providesTags: ["Bookshelves"],
    }),
    getAnnotations: builder.query({
      query: () => ({
        url: "mylibrary/annotations",
        method: "GET",
      }),
    }),
    addVolumeToBookshelf: builder.mutation({
      query: ({ shelf, volumeId }: { shelf: string | number; volumeId: string }) => ({
        url: `mylibrary/bookshelves/${shelf}/addVolume`,
        method: "POST",
        body: { volumeId },
      }),
      invalidatesTags: ["Bookshelves"],
    }),
    moveVolumeInBookshelf: builder.mutation({
      query: ({ shelf, volumeId }: { shelf: string | number; volumeId: string }) => ({
        url: `mylibrary/bookshelves/${shelf}/moveVolume`,
        method: "POST",
        body: { volumeId },
      }),
      invalidatesTags: ["Bookshelves"],
    }),
    removeVolumeFromBookshelf: builder.mutation({
      query: ({
        shelf,
        volumeId,
      }: {
        shelf: string | number;
        volumeId: string;
      }) => ({
        url: `mylibrary/bookshelves/${shelf}/removeVolume`,
        method: "POST",
        body: { volumeId },
      }),
      invalidatesTags: ["Bookshelves"],
    }),
  }),
});

export const {
  useGetVolumesQuery,
  useGetVolumeQuery,
  useLazyGetVolumeQuery,
  useGetBookshelvesQuery,
  useGetAnnotationsQuery,
  useAddVolumeToBookshelfMutation,
  useMoveVolumeInBookshelfMutation,
  useRemoveVolumeFromBookshelfMutation,
} = googleBooksApi;
