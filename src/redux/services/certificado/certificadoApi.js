import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:5000/";
//const BASE_URL = "https://d360api.ucuenca.edu.ec";

export const certificadoApi = createApi({
  reducerPath: "certificadoApi",
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
