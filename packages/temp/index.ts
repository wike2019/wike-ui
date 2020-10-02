import ElIcon from "./src/Icon";
import { App } from "vue";

ElIcon.install = (app: App) => {
  app.component(ElIcon.name, ElIcon);
};

export default ElIcon;
