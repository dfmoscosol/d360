import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//const BASE_URL = "http://127.0.0.1:5000/";
const BASE_URL = "https://d360api.ucuenca.edu.ec";

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
