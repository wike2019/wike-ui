import { App, Plugin } from "vue";
import WIcon from "./Icon/index";
import WMd from "./Md/index";

const components = [WIcon, WMd];

const install = function (Vue: App): void {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

const wikeUi: Plugin = {
  install,
};

export default wikeUi;