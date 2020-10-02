import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";


const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
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
