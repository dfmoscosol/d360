import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//const BASE_URL = "http://127.0.0.1:5000/";
const BASE_URL = "https://d360api.ucuenca.edu.ec";

export const tallerApi = createApi({
  reducerPath: "tallerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().authState.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  //tagTypes: ["getAll", "getCapacitacion"],
  endpoints: (builder) => ({
    /*getCapacitacion: builder.query({
      query: (params) => `/capacitacion/${params.value}`,
      providesTags: ["getCapacitacion"],
    }),*/
    addTaller: builder.mutation({
      query: (params) => ({
        url: `/eventos/${params.id_evento}/talleres`,
        method: "POST",
        body: params.body,
      }),
      invalidatesTags: ["getAll"],
    }),
    editTaller: builder.mutation({
      query: (params) => ({
        url: `/eventos/${params.id_evento}/talleres/${params.id}`,
        method: "PATCH",
        body: params.body,
      }),
      //invalidatesTags: ["getCapacitacion", "getAll"],
    }),
    /*getAllCapacitaciones: builder.query({
      query: () => `/capacitaciones`,
      providesTags: ["getAll"],
    }),*/
    deleteTaller: builder.mutation({
      query: (params) => ({
        url: `/eventos/jornadas/talleres/${params.id}`,
        method: "DELETE",
      }),
      //invalidatesTags: ["getAll"],
    }),
  }),
});

export const {
  //useAddEventoMutation,
  //useGetAllCapacitacionesQuery,
  //useGetCapacitacionQuery,
  useEditTallerMutation,
  useAddTallerMutation,
  useDeleteTallerMutation,
} = tallerApi;
