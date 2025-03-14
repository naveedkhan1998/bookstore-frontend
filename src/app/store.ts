import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "../services/baseApi";
import { baseApi as booksApi } from "../services/BooksApi";
import authReducer from "../features/authSlice";
import userReducer from "../features/userSlice";
import elixirReducer from "../features/elixirSlice";
import booksReducer from "../features/booksSlice";
import settingReducer from "../features/settingSlice";
import booklistsReducer from "../features/booklistSlice";
import publicBooklistReducer from "../features/publicBooklistSlice";
import cartReducer from "../features/cartSlice";
import loadBookReducer from "../features/loadBookSlice";
import refreshReducer from "../features/refreshSlice";

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
