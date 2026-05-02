<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="nav-inner">
      <router-link to="/" class="nav-logo" @mouseenter="logoHover = true" @mouseleave="logoHover = false">
        <span class="logo-icon" :class="{ glow: logoHover }">&#10022;</span>
        <span class="logo-text">我的空间</span>
      </router-link>
      <button class="mobile-toggle" @click="menuOpen = !menuOpen" :class="{ active: menuOpen }">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" :class="{ open: menuOpen }" ref="navLinksEl">
        <li v-for="link in links" :key="link.path">
          <router-link :to="link.path" @click="menuOpen = false">{{ link.name }}</router-link>
        </li>
        <div class="nav-indicator" :style="indicatorStyle"></div>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isScrolled = ref(false)
const menuOpen = ref(false)
const logoHover = ref(false)
const navLinksEl = ref(null)
const indicatorStyle = ref({ opacity: 0 })

const links = [
  { path: '/', name: '首页' },
  { path: '/about', name: '关于我' },
  { path: '/vision', name: '未来展望' },
  { path: '/music', name: '音乐空间' },
  { path: '/devnotes', name: '开发心得' },
]

function onScroll() {
  isScrolled.value = window.scrollY > 30
}

function updateIndicator() {
  nextTick(function() {
    if (!navLinksEl.value) return
    var el = navLinksEl.value.querySelector('.router-link-exact-active')
    if (el) {
      var pr = navLinksEl.value.getBoundingClientRect()
      var lr = el.getBoundingClientRect()
      indicatorStyle.value = {
        left: (lr.left - pr.left) + 'px',
        width: lr.width + 'px',
        opacity: 1,
      }
    } else {
      indicatorStyle.value = { opacity: 0 }
    }
  })
}

onMounted(function() {
  window.addEventListener('scroll', onScroll)
  updateIndicator()
})

onUnmounted(function() {
  window.removeEventListener('scroll', onScroll)
})

watch(function() { return route.path }, function() {
  updateIndicator()
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 0;
  transition: all 0.4s ease;
}

.navbar.scrolled {
  background: rgba(10, 10, 26, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 10px 0;
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.2rem;
}

.logo-icon {
  font-size: 1.5rem;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: float 3s ease-in-out infinite;
  transition: all 0.3s ease;
  display: inline-block;
}

.logo-icon.glow {
  filter: drop-shadow(0 0 12px rgba(102, 126, 234, 0.6));
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 8px;
  position: relative;
}

.nav-indicator {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-1), var(--accent-3));
  border-radius: 1px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.5);
}

.nav-links a {
  display: block;
  padding: 8px 18px;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-links a:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.06);
}

.nav-links a.router-link-exact-active {
  color: var(--accent-1);
  background: rgba(102, 126, 234, 0.12);
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.mobile-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.mobile-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.mobile-toggle.active span:nth-child(2) { opacity: 0; }
.mobile-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

@media (max-width: 768px) {
  .mobile-toggle { display: flex; }
  .nav-links {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(10, 10, 26, 0.95);
    backdrop-filter: blur(20px);
    padding: 16px;
    gap: 4px;
    transform: translateY(-120%);
    transition: transform 0.3s ease;
    border-bottom: 1px solid var(--glass-border);
  }
  .nav-links.open { transform: translateY(0); }
  .nav-indicator { display: none; }
  .nav-links a { padding: 12px 18px; font-size: 1rem; }
}
</style>
