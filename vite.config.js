import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@components",
        replacement: "/src/components",
      },
      {
        find: "@layouts",
        replacement: "/src/layouts",
      },
      {
        find: "@pages",
        replacement: "/src/pages",
      },
      {
        find: "@routes",
        replacement: "/src/routes",
      },
      {
        find: "@assets",
        replacement: "/src/assets",
      },
      {
        find: "@redux",
        replacement: "/src/redux",
      },
    ],
  },
});
