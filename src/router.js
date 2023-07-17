import Home from '@/containers/Home.vue';

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
 { path: '/', component: Home },
 { path: '/browse', component: Home }
]

export default createRouter({
 history: createWebHistory(),
 routes
})