import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://mdlk8s.ucuenca.edu.ec/ms/pentagono-d360/api/";

/**
 * Base query con autenticación Bearer Token.
 * Usar en todos los API slices que requieran autenticación.
 */
export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().authState?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Base query sin autenticación.
 * Usar en endpoints públicos como login.
 */
export const baseQueryPublic = fetchBaseQuery({
  baseUrl: BASE_URL,
});
