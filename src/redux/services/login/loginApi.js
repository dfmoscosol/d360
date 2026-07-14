import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//const BASE_URL = "https://desa-k8s.ucuenca.edu.ec/ms/pentagono-d360/api/";
const BASE_URL = "https://mdlk8s.ucuenca.edu.ec/ms/pentagono-d360/api/";

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
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
