import { App, Plugin } from "vue";
import WIcon from "./Icon/index";

const components = [WIcon];

const install = function (Vue: App): void {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

const wikeUi: Plugin = {
  install,
};

export default wikeUi;
