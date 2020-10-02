import WIcon from "./src/Icon";
import { App } from "vue";

WIcon.install = (app: App) => {
  app.component(WIcon.name, WIcon);
};

export default WIcon;
