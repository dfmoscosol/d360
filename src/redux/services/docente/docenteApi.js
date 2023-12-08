import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://d360api.ucuenca.edu.ec";

export const docenteApi = createApi({
  reducerPath: "docenteApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  //tagTypes: ["getAll", "getCapacitacion"],
  endpoints: (builder) => ({
    getAllDocentes: builder.query({
      query: (params) => `/docentes_disponibles/${params.value}`,
      //providesTags: ["getCapacitacion"],
    }),
    /*
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
      //invalidatesTags: ["getCapacitacion", "getAll"],
    }),
    getAllCapacitaciones: builder.query({
      query: () => `/capacitaciones`,
      providesTags: ["getAll"],
    }),
    deleteEvento: builder.mutation({
      query: (params) => ({
        url: `/eliminar_capacitacion/${params.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["getAll"],
    }),
    */
  }),
});

export const {
  //useAddEventoMutation,
  useGetAllDocentesQuery,
  //useGetCapacitacionQuery,
  //useEditCapacitacionMutation,
  //useDeleteEventoMutation,
} = docenteApi;
