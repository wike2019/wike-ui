import { UserConfig } from "vite";

import path from "path";

const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr);
};

const config: UserConfig = {
  alias: {
    "/@/": pathResolve("./examples/src"),
  },
  outDir: pathResolve("./examples/dist"),
  plugins: [],
  optimizeDeps:{
    include:["/node_modules/codemirror/lib/codemirror.less"]
  },
};
module.exports = config;
