<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="scroll-progress" :style="{ width: scrollPercent + '%' }" role="progressbar" :aria-valuenow="Math.round(scrollPercent)" aria-valuemin="0" aria-valuemax="100" aria-label="页面滚动进度"></div>
    <div class="nav-border-glow"></div>
    <div class="nav-shine"></div>

    <div class="nav-inner">
      <router-link to="/" class="nav-logo" @mouseenter="logoHover = true" @mouseleave="logoHover = false">
        <span class="logo-orbit"></span>
        <span class="logo-icon" :class="{ glow: logoHover }">&#10022;</span>
        <span class="logo-text">我的空间</span>
        <span class="logo-dot"></span>
      </router-link>

      <div class="nav-right">
        <button class="theme-toggle" @click="toggleTheme" :aria-label="theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'">
          <span class="theme-icon" :class="{ light: theme === 'light' }">{{ theme === 'dark' ? '☀️' : '🌙' }}</span>
        </button>
        <button class="mobile-toggle" @click="menuOpen = !menuOpen" :class="{ active: menuOpen }" :aria-expanded="menuOpen" aria-controls="nav-links-list" aria-label="导航菜单">
          <span></span><span></span><span></span>
        </button>
      </div>

      <ul class="nav-links" :class="{ open: menuOpen }" ref="navLinksEl" id="nav-links-list">
        <li v-for="link in links" :key="link.path">
          <router-link :to="link.path" @click="menuOpen = false">
            <span class="link-icon">{{ link.icon }}</span>
            <span class="link-text">{{ link.name }}</span>
          </router-link>
        </li>
        <div class="nav-indicator" :style="indicatorStyle"></div>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme.js'

const route = useRoute()
const { theme, toggle: toggleTheme } = useTheme()

const isScrolled = ref(false)
const menuOpen = ref(false)
const logoHover = ref(false)
const navLinksEl = ref(null)
const indicatorStyle = ref({ opacity: 0 })
const scrollPercent = ref(0)

const links = [
  { path: '/', name: '首页', icon: '⌂' },
  { path: '/about', name: '关于我', icon: '☺' },
  { path: '/projects', name: '项目', icon: '⊞' },
  { path: '/skills', name: '技能', icon: '◈' },
  { path: '/vision', name: '展望', icon: '◇' },
  { path: '/music', name: '音乐', icon: '♫' },
  { path: '/devnotes', name: '心得', icon: '✎' },
  { path: '/contact', name: '联系', icon: '✉' },
]

const onScroll = () => {
  isScrolled.value = window.scrollY > 30
  const docH = document.documentElement.scrollHeight - window.innerHeight
  scrollPercent.value = docH > 0 ? (window.scrollY / docH) * 100 : 0
}

const updateIndicator = () => {
  nextTick(() => {
    if (!navLinksEl.value) return
    const el = navLinksEl.value.querySelector('.router-link-exact-active')
    if (el) {
      const pr = navLinksEl.value.getBoundingClientRect()
      const lr = el.getBoundingClientRect()
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

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  updateIndicator()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

watch(() => route.path, () => {
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
  font-family: var(--font-sans);
}

.scroll-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--neon-purple), var(--neon-cyan), var(--neon-pink));
  background-size: 200% 100%;
  animation: progressShimmer 3s linear infinite;
  transition: width 0.1s linear;
  z-index: 10;
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.5), 0 0 4px rgba(6, 182, 212, 0.3);
}
@keyframes progressShimmer {
  0% { background-position: 0% 0%; }
  100% { background-position: 200% 0%; }
}

.nav-border-glow {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(168,85,247,0.3) 20%, rgba(6,182,212,0.5) 50%, rgba(168,85,247,0.3) 80%, transparent);
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 5;
}
.navbar.scrolled .nav-border-glow {
  opacity: 1;
  animation: borderGlowPulse 4s ease-in-out infinite;
}
@keyframes borderGlowPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.nav-shine {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 3;
}
.navbar.scrolled .nav-shine { opacity: 1; }
.nav-shine::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(168,85,247,0.03) 30%, rgba(6,182,212,0.05) 50%, rgba(168,85,247,0.03) 70%, transparent);
  animation: navShineScan 6s ease-in-out infinite;
}
@keyframes navShineScan {
  0% { left: -100%; }
  50% { left: 100%; }
  100% { left: 100%; }
}

.navbar.scrolled {
  background: rgba(5, 5, 16, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(168, 85, 247, 0.08);
  padding: 10px 0;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4), 0 0 60px rgba(168, 85, 247, 0.04);
}

[data-theme="light"] .navbar.scrolled {
  background: rgba(240, 240, 255, 0.88);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.06);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.15rem;
  position: relative;
  font-family: var(--font-display);
}

.logo-icon {
  font-size: 1.5rem;
  background: linear-gradient(135deg, var(--neon-purple), var(--neon-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: float 3s ease-in-out infinite;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
  z-index: 2;
}
.logo-icon.glow { filter: drop-shadow(0 0 16px rgba(168, 85, 247, 0.8)); transform: scale(1.15); }

.logo-orbit {
  position: absolute;
  width: 40px;
  height: 40px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(168, 85, 247, 0.12);
  border-radius: 50%;
  animation: logoOrbit 8s linear infinite;
  z-index: 0;
}
.logo-orbit::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 50%;
  width: 4px;
  height: 4px;
  background: var(--neon-purple);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--neon-purple);
}
@keyframes logoOrbit { to { transform: translate(-50%, -50%) rotate(360deg); } }

.logo-dot {
  width: 5px;
  height: 5px;
  background: var(--neon-cyan);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--neon-cyan);
  animation: logoDotPulse 2s ease-in-out infinite;
  margin-left: -4px;
  margin-top: 2px;
  flex-shrink: 0;
}
@keyframes logoDotPulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.4); }
}

.logo-text { position: relative; z-index: 2; }

.nav-right { display: flex; align-items: center; gap: 12px; }

/* 主题切换 */
.theme-toggle {
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  border: 1px solid var(--glass-border);
  background: var(--bg-card);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}
.theme-toggle::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: conic-gradient(var(--neon-purple), var(--neon-cyan), var(--neon-pink), var(--neon-purple));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
  animation: themeRing 4s linear infinite;
}
.theme-toggle:hover::before { opacity: 0.4; }
@keyframes themeRing { to { transform: rotate(360deg); } }
.theme-toggle:hover { border-color: transparent; background: rgba(168, 85, 247, 0.12); transform: scale(1.1) rotate(15deg); }
.theme-icon { font-size: 1rem; transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); position: relative; z-index: 1; }
.theme-icon.light { transform: rotate(180deg); }

/* 导航链接 */
.nav-links { display: flex; list-style: none; gap: 2px; position: relative; }

.nav-indicator {
  position: absolute;
  bottom: -2px;
  height: 3px;
  background: linear-gradient(90deg, var(--neon-purple), var(--neon-cyan));
  border-radius: 2px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.5), 0 0 4px rgba(6, 182, 212, 0.3);
}

.nav-links a {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius);
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  letter-spacing: 1px;
}

.nav-links a::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(168,85,247,0.06), rgba(6,182,212,0.04));
  opacity: 0;
  transition: opacity 0.3s ease;
}
.nav-links a:hover::before { opacity: 1; }

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--neon-purple), var(--neon-cyan));
  border-radius: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-50%);
  box-shadow: 0 0 6px rgba(168, 85, 247, 0.4);
}
.nav-links a:hover::after { width: 60%; }

.link-icon { font-size: 0.75rem; opacity: 0.4; transition: all 0.3s ease; }
.nav-links a:hover .link-icon { opacity: 1; transform: scale(1.15); }
.nav-links a.router-link-exact-active .link-icon { opacity: 1; }

.link-text { position: relative; z-index: 1; }

.nav-links a:hover { color: var(--text-primary); transform: translateY(-1px); }

.nav-links a.router-link-exact-active {
  color: var(--neon-purple);
  background: rgba(168, 85, 247, 0.1);
  text-shadow: 0 0 15px rgba(168, 85, 247, 0.3);
}

/* 移动端 */
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
  width: 22px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}
.mobile-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); background: var(--neon-purple); }
.mobile-toggle.active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.mobile-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); background: var(--neon-cyan); }

@media (max-width: 768px) {
  .mobile-toggle { display: flex; }
  .nav-links {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(5, 5, 16, 0.95);
    backdrop-filter: blur(20px);
    padding: 16px;
    gap: 4px;
    transform: translateY(-120%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-bottom: 1px solid var(--glass-border);
  }
  [data-theme="light"] .nav-links { background: rgba(240, 240, 255, 0.95); }
  .nav-links.open { transform: translateY(0); }
  .nav-indicator { display: none; }
  .nav-links a { padding: 12px 18px; font-size: 0.95rem; }
  .theme-toggle { display: none; }
  .logo-orbit { display: none; }
}
</style>
