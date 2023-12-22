import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://d360api.ucuenca.edu.ec";

export const keywordApi = createApi({
  reducerPath: "keywordApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().authState.token;
      if (token) {
        console.log("token keywordApi", token)
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        console.log("no token certificadoApi");
      }
      return headers;
    },
  }),
  tagTypes: ["getAll", "getCapacitacion"],
  endpoints: (builder) => ({
    /*getCapacitacion: builder.query({
      query: (params) => `/capacitacion/${params.value}`,
      providesTags: ["getCapacitacion"],
    }),*/
    /*addEvento: builder.mutation({
      query: (params) => ({
        url: `/crear_capacitacion`,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["getAll"],
    }),*/
    updateKeyword: builder.mutation({
      query: (params) => ({
        url: `/actualizar_termino/${params.competencia}/${params.id}`,
        method: "PUT",
        body: params.body,
      }),
      //invalidatesTags: ["getCapacitacion", "getAll"],
    }),
    deleteKeyword: builder.mutation({
      query: (params) => ({
        url: `/eliminar_termino/${params.competencia}/${params.id}`,
        method: "DELETE",
      }),
      //invalidatesTags: ["getCapacitacion", "getAll"],
    }),
    getAllKeywords: builder.query({
      query: (params) => `/terminos/${params.value}`,
      providesTags: ["getAll"],
    }),

    /*getCapacitacion: builder.query({
      query: (params) => `/capacitacion/${params.value}`,
      providesTags: ["getCapacitacion"],
    }),*/
    /*deleteTaller: builder.mutation({
      query: (params) => ({
        url: `/eliminar_taller/${params.id}`,
        method: "DELETE",
      }),
      //invalidatesTags: ["getAll"],
    }),*/
  }),
});

export const {
  useGetAllKeywordsQuery,
  useUpdateKeywordMutation,
  useDeleteKeywordMutation,
} = keywordApi;
