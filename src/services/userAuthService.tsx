import { Credentials } from "../comman-types";
import { baseApi } from "./baseApi";

export const userAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials: Credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    registerUser: builder.mutation({
      query: (user) => {
        return {
          url: "/auth/sign_up",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    getLoggedUser: builder.query({
      query: (access_token) => {
        return {
          url: "/auth/me",
          method: "GET",
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
    googleLogin: builder.query({
      query: () => {
        return {
          url: "/auth/google",
          method: "GET",
        };
      },
    }),
    sendEmail: builder.query({
      query: ({ access_token }) => {
        return {
          url: "/auth/invoke_verify_email",
          method: "GET",
          headers: {
            "x-auth-token": `${access_token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetLoggedUserQuery,
  useGoogleLoginQuery,
  useLazySendEmailQuery,
} = userAuthApi;
