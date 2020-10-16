import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";


const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => {
      return import("/@/views/Home/Home.vue")
    },
  },
  {
    path: "/icon",
    name: "icon",
    component: () => {
      return import("/@/views/Icon/Icon.tsx")
    },
  },
  {
    path: "/md",
    name: "md",
    component: () => {
      return import("/@/views/Home/Home.vue")
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
export { routes };
