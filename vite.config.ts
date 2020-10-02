import { UserConfig } from "vite";

import path from "path";

const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr);
};

const config: UserConfig = {
  alias: {
    "/@/": pathResolve("./examples/src"),
    vue: "vue/dist/vue.esm-bundler.js",
  },
  outDir: pathResolve("./examples/dist"),
  plugins: [

  ],
};

module.exports = config;
