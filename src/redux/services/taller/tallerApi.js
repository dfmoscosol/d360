import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../apiConfig";


export const tallerApi = createApi({
  reducerPath: "tallerApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
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
    }),
    deleteTaller: builder.mutation({
      query: (params) => ({
        url: `/eventos/jornadas/talleres/${params.id}`,
        method: "DELETE",
      }),
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
