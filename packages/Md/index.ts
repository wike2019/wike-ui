import WMd from "./src/Md";
import { App } from "vue";

WMd.install = (app: App) => {
  app.component(WMd.name, WMd);
};

export default WMd;
