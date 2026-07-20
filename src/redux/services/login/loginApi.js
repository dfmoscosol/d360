import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryPublic } from "../apiConfig";

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: baseQueryPublic,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: `/login`,
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const { useLoginMutation } = loginApi;
