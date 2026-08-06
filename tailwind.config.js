/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // EL AZUL DE LA U
        primary_color_1: "#002856",

        // EL ROJO DE LA U
        primary_color_2: "#A51008",

        // EL AZUL OSCURO
        primary_text_1: "#121923",

        // EL GRIS DE LOS TEXTOS Y FONDO

        primary_gray_1: "#f8f9fb",
        primary_gray_2: "#999999",
        primary_gray_3: "#777777",
        primary_gray_4: "#6f6f6e",
        primary_gray_5: "#E1E1E1", //claro

        // Colores para tipos de evento
        evento_jornada: "#001F66",
        evento_charla: "#a60000",
        evento_microtaller: "#4d4d4d",
        evento_observacion: "#cccccc",

        /*

        primary_gray_1: "#f8f9fb",
        primary_gray_2: "#8e8e93",
        primary_gray_3: "#6c6c70",
        primary_gray_4: "#636366",
        

        side_gray: "#f2f2f7",

        primary_color_1_text_light: "#cef4ff",
        primary_color_1_bg_light: "#22536E",

        primary_color_2_text_light: "#ffcccb",
        primary_color_2_text_light_hover: "#fff1f0",
        primary_color_2_text_light_active: "#ffe0de",

        secondary_color_1: "#f5f5f7",
        secondary_color_2: "#6e6e73",
        secondary_color_3: "#a4a6aa",


        */
      },
    },
  },
  plugins: [],
};
