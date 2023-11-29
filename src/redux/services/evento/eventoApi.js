import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://d360api.ucuenca.edu.ec";

export const eventoApi = createApi({
  reducerPath: "eventoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["getAll", "getCapacitacion"],
  endpoints: (builder) => ({
    getCapacitacion: builder.query({
      query: (params) => `/capacitacion/${params.value}`,
      providesTags: ["getCapacitacion"],
    }),
    addEvento: builder.mutation({
      query: (params) => ({
        url: `/crear_capacitacion`,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["getAll"],
    }),
    editCapacitacion: builder.mutation({
      query: (params) => ({
        url: `/actualizar_capacitacion/${params.id}`,
        method: "PUT",
        body: params.body,
      }),
      invalidatesTags: ["getCapacitacion", "getAll"],
    }),
    getAllCapacitaciones: builder.query({
      query: () => `/capacitaciones`,
      providesTags: ["getAll"],
    }),
  }),
});

export const {
  useAddEventoMutation,
  useGetAllCapacitacionesQuery,
  useGetCapacitacionQuery,
  useEditCapacitacionMutation,
} = eventoApi;
