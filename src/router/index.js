import {  createRouter, createWebHashHistory } from 'vue-router';

import textBus from  '../views/textBus.vue'
import about from  '../views/about.vue'
import more from  '../views/more.vue'
import markdown from  '../views/markdown.vue'
const routes= [
    {
        path: '/textBus',
        name: 'textBusView',
        component: textBus
    },
    {
        path: '/markdown',
        name: 'markdown',
        component: markdown
    },
    {
        path: '/more',
        name: 'more',
        component: more
    },
    {
        path: '/about',
        name: 'about',
        component: about
    },
    {
        path: '/',
        redirect:"/markdown"
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
