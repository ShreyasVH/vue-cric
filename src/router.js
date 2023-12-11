import Home from '@/containers/Home.vue';
import TourDetails from '@/containers/tours/Details.vue';
import SeriesDetails from '@/containers/series/Details.vue';
import MatchDetail from '@/containers/matches/Detail.vue';

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
 { path: '/', component: Home },
 { path: '/browse', component: Home },
 { path: '/tours/detail', component: TourDetails },
 { path: '/series/detail', component: SeriesDetails },
 { path: '/matches/detail', component: MatchDetail }
]

export default createRouter({
 history: createWebHistory(),
 routes
})