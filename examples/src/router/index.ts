import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";


const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => {
      return import('/@/views/Home/Home.tsx')
    },
  },
  {
    path: "/icon",
    name: "icon",
    component: () => {
      return import('/@/views/Icon/Icon.tsx')
    },
  },
  {
    path: "/md",
    name: "md",
    component: () => {
      return import('/@/views/Home/Home.tsx')
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
export { routes };
