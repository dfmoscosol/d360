import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../apiConfig";

export const keywordApi = createApi({
  reducerPath: "keywordApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["getAll"],
  endpoints: (builder) => ({
    updateKeyword: builder.mutation({
      query: (params) => ({
        url: `/actualizar_termino/${params.competencia}/${params.id}`,
        method: "PUT",
        body: params.body,
      }),
    }),
    deleteKeyword: builder.mutation({
      query: (params) => ({
        url: `/eliminar_termino/${params.competencia}/${params.id}`,
        method: "DELETE",
      }),
    }),
    getAllKeywords: builder.query({
      query: (params) => `/terminos/${params.value}`,
      providesTags: ["getAll"],
    }),
  }),
});

export const {
  useGetAllKeywordsQuery,
  useUpdateKeywordMutation,
  useDeleteKeywordMutation,
} = keywordApi;
