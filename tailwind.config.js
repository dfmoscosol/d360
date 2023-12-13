/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary_color_1: "#002856",
        primary_color_2: "#A51008",

        primary_gray_1: "#f8f9fb",
        primary_gray_2: "#8e8e93",
        primary_gray_3: "#6c6c70",
        primary_gray_4: "#636366",
        primary_gray_5: "#E1E1E1",

        side_gray: "#f2f2f7",

        primary_color_1_text_light: "#cef4ff",
        primary_color_1_bg_light: "#22536E",

        secondary_color_1: "#f5f5f7",
        secondary_color_2: "#6e6e73",
        secondary_color_3: "#a4a6aa",
      },
    },
  },
  plugins: [],
};
