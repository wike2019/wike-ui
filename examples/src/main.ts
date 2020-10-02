import { createApp } from "vue";
// @ts-ignore
import App from "./App";
import router from "./router";

import "../../dist/style/wike-ui.min.css";

const app = createApp(App);

app.use(router).mount("#app");
