import path from 'path';

export default {
  root: "",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "~": path.resolve(__dirname, "./"),
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
};
