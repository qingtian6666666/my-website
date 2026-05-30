import { createRouter, createWebHashHistory } from 'vue-router'

const Home = () => import('../views/Home.vue')
const About = () => import('../views/About.vue')
const Vision = () => import('../views/Vision.vue')
const Music = () => import('../views/Music.vue')
const DevNotes = () => import('../views/DevNotes.vue')
const Projects = () => import('../views/Projects.vue')
const Skills = () => import('../views/Skills.vue')
const Contact = () => import('../views/Contact.vue')
const NotFound = () => import('../views/NotFound.vue')

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/vision', name: 'Vision', component: Vision },
  { path: '/music', name: 'Music', component: Music },
  { path: '/devnotes', name: 'DevNotes', component: DevNotes },
  { path: '/projects', name: 'Projects', component: Projects },
  { path: '/skills', name: 'Skills', component: Skills },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
