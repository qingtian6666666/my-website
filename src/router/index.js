import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Vision from '../views/Vision.vue'
import Music from '../views/Music.vue'
import DevNotes from '../views/DevNotes.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/vision', name: 'Vision', component: Vision },
  { path: '/music', name: 'Music', component: Music },
  { path: '/devnotes', name: 'DevNotes', component: DevNotes },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
