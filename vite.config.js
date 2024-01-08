import path from 'path';

export default {
  root: "",
  resolve: {
    alias: {
      "@scripts": path.resolve(__dirname, "./js"),
      "@styles": path.resolve(__dirname, "./style"),
      "@images": path.resolve(__dirname, "./images"),
      "@": path.resolve(__dirname, "./"),
      "~": path.resolve(__dirname, "./"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
};
