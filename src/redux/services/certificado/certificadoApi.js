import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../apiConfig";

export const certificadoApi = createApi({
  reducerPath: "certificadoApi",
  baseQuery: baseQueryWithAuth,
  // tagTypes: ["Docente"],
  endpoints: (builder) => ({
    getAllCertificados: builder.query({
      query: () => `/certificados`,
      // providesTags: ["getAll"],
    }),
    editCertificado: builder.mutation({
      query: (params) => ({
        url: `/certificados/${params.id}`,
        method: "PUT",
        body: params.body,
      }),
      // invalidatesTags: ["getCapacitacion", "getAll"],
    }),
    getAllParameters: builder.query({
      query: () => `/parametros`,
      // providesTags: ["getParameters"],
    }),
    // New endpoint for updating parameters
    updateParameters: builder.mutation({
      query: (params) => ({
        url: `/parametros`,
        method: "PUT",
        body: params,
      }),
      // invalidatesTags: ["getParameters"],
    }),
  }),
});

export const {
  useGetAllCertificadosQuery,
  useEditCertificadoMutation,
  useGetAllParametersQuery,
  useUpdateParametersMutation, 
} = certificadoApi;
