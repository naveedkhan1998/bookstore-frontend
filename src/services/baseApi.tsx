import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../features/authSlice";
import { getToken, storeToken, removeToken } from "./LocalStorageService";
import { RootState } from "../app/store";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://wizard-world-api.herokuapp.com/",
  //baseUrl: "http://localhost:5000",
  //credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.access;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAutoRefresh = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    //console.log('sending refres_token')
    // send refresh token
    //let refresh_token = api.useSelector(getCurrentRefreshToken)
    const { access_token, refresh_token } = getToken();

    const refrehResult: any = await baseQuery(
      {
        url: "/api/user/refresh_token/",
        method: "POST",
        body: { refresh: refresh_token },
        headers: {
          "Content-Type": "application/json",
        },
      },
      api,
      extraOptions
    );
    console.log(refrehResult);
    if (refrehResult?.data) {
      //const user = api.getState().auth.user
      // store new_token
      storeToken(refrehResult.data);
      api.dispatch(setCredentials({ ...refrehResult.data }));
      //retry
      result = await baseQuery(
        {
          ...args,
          headers: {
            Authorization: `Bearer ${refrehResult.data.access}`,
          },
        },
        api,
        extraOptions
      );
    } else {
      api.dispatch(logOut());
      removeToken();
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath:'baseApi',
  baseQuery: baseQueryWithAutoRefresh,
  endpoints: (builder) => ({}),
});
