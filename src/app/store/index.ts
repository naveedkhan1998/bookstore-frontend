import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "@/services/api/baseApi";
import { booksApi } from "@/services/api/booksApi";
import authReducer from "@/features/auth/authSlice";
import userReducer from "@/features/user/userSlice";
import elixirReducer from "@/features/elixirs/elixirSlice";
import booksReducer from "@/features/books/booksSlice";
import loadBookReducer from "@/features/books/loadBookSlice";
import settingReducer from "@/features/settings/settingSlice";
import booklistsReducer from "@/features/booklists/booklistSlice";
import publicBooklistReducer from "@/features/booklists/publicBooklistSlice";
import cartReducer from "@/features/cart/cartSlice";
import refreshReducer from "@/features/session/refreshSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [booksApi.reducerPath]: booksApi.reducer,
    auth: authReducer,
    user: userReducer,
    elixirs: elixirReducer,
    books: booksReducer,
    setting: settingReducer,
    userbooklists: booklistsReducer,
    publicbooklists: publicBooklistReducer,
    usercart: cartReducer,
    loadbook: loadBookReducer,
    refresh: refreshReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, booksApi.middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
