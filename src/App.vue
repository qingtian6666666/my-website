<template>
  <div id="app-root">
    <transition name="splash-fade">
      <div v-if="showSplash" class="splash-screen">
        <div class="splash-logo">&#10022; 我的空间</div>
        <div class="splash-bar-wrap"><div class="splash-bar"></div></div>
      </div>
    </transition>

    <div class="cursor-glow" :style="cursorStyle" aria-hidden="true"></div>

    <a class="skip-link" href="#main-content">跳过导航</a>

    <ParticlesBg />
    <NavBar />

    <main id="main-content">
      <router-view v-slot="slotProps">
        <transition name="page" mode="out-in">
          <component :is="slotProps.Component" />
        </transition>
      </router-view>
    </main>

    <AudioPlayer />

    <button v-show="showTop" class="back-to-top" @click="toTop" aria-label="返回顶部">&#8593;</button>

    <footer class="app-footer">
      <div class="footer-glow"></div>
      <div class="footer-content">
        <div class="footer-brand">
          <span class="footer-logo">&#10022;</span>
          <span class="footer-name">Bob Song 的个人空间</span>
        </div>
        <div class="footer-links">
          <a href="https://github.com/qingtian6666666" target="_blank" rel="noopener" class="footer-social" title="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a href="mailto:2434005232@qq.com" class="footer-social" title="邮箱">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </a>
        </div>
      </div>
      <div class="footer-divider"></div>
      <p class="footer-copy">用代码书写未来 &middot; 2026</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import NavBar from './components/NavBar.vue'
import ParticlesBg from './components/ParticlesBg.vue'
const AudioPlayer = defineAsyncComponent(() => import('./components/AudioPlayer.vue'))
import { useMousePosition } from './composables/useMousePosition.js'
import { useTheme } from './composables/useTheme.js'

// 主题初始化
useTheme()

// 鼠标跟随光效
const { x: mouseX, y: mouseY } = useMousePosition()
const cursorStyle = computed(() => ({
  left: mouseX.value + 'px',
  top: mouseY.value + 'px',
}))

const showSplash = ref(true)
const showTop = ref(false)
let obs = null
let mo = null

const onScroll = () => { showTop.value = window.scrollY > 400 }
const toTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }) }

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })

  setTimeout(() => { showSplash.value = false }, 600)

  setTimeout(() => {
    try {
      obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed') })
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
      const sels = '.scroll-reveal,.scroll-reveal-scale'
      document.querySelectorAll(sels).forEach((el) => { obs.observe(el) })

      // MutationObserver 回调添加防抖
      let moTimer = null
      mo = new MutationObserver(() => {
        if (moTimer) clearTimeout(moTimer)
        moTimer = setTimeout(() => {
          document.querySelectorAll(sels).forEach((el) => {
            if (!el.dataset.seen) { el.dataset.seen = '1'; obs.observe(el) }
          })
        }, 100)
      })
      mo.observe(document.getElementById('app-root'), { childList: true, subtree: true })
    } catch (e) { console.warn('滚动动画初始化失败:', e) }
  }, 300)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (obs) obs.disconnect()
  if (mo) mo.disconnect()
})
</script>

<style>
#app-root {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Splash */
.splash-screen {
  position: fixed;
  inset: 0;
  background: #050510;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.splash-fade-leave-active { transition: opacity 0.6s ease; }
.splash-fade-leave-to { opacity: 0; pointer-events: none; }
.splash-logo {
  font-size: 2.5rem;
  font-weight: 800;
  font-family: 'JetBrains Mono', 'Noto Sans SC', sans-serif;
  background: linear-gradient(135deg, #a855f7, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 32px;
  animation: sp 1.5s ease-in-out infinite;
  letter-spacing: 4px;
}
.splash-bar-wrap { width: 200px; height: 2px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
.splash-bar { height: 100%; width: 0; background: linear-gradient(90deg, #a855f7, #06b6d4); border-radius: 2px; animation: spLoad 1.2s ease forwards; }
@keyframes sp { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(1.03)} }
@keyframes spLoad { 0%{width:0} 50%{width:70%} 100%{width:100%} }

/* Page Transitions */
.page-enter-active { animation: pageIn 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.page-leave-active { animation: pageOut 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
@keyframes pageIn {
  0% { opacity: 0; transform: translateY(20px) scale(0.98); filter: blur(4px); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
@keyframes pageOut {
  0% { opacity: 1; transform: scale(1); filter: blur(0); }
  100% { opacity: 0; transform: scale(0.97); filter: blur(4px); }
}

/* Footer */
.app-footer { position: relative; text-align: center; padding: 40px 24px 28px; color: var(--text-muted); font-size: 0.8rem; margin-top: auto; overflow: hidden; font-family: var(--font-mono); }
.footer-glow { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 400px; height: 1px; background: linear-gradient(90deg, transparent, #a855f7, #06b6d4, #a855f7, transparent); opacity: 0.5; }
.footer-content { display: flex; align-items: center; justify-content: space-between; max-width: 600px; margin: 0 auto 20px; }
.footer-brand { display: flex; align-items: center; gap: 10px; }
.footer-logo { font-size: 1.3rem; background: linear-gradient(135deg, #a855f7, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.footer-name { font-weight: 600; color: var(--text-secondary); font-size: 0.9rem; letter-spacing: 1px; }
.footer-links { display: flex; gap: 12px; }
.footer-social { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius); background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); color: var(--text-secondary); transition: all 0.3s ease; text-decoration: none; }
.footer-social:hover { background: rgba(168,85,247,0.1); border-color: rgba(168,85,247,0.4); color: #a855f7; transform: translateY(-2px); box-shadow: 0 0 15px rgba(168,85,247,0.2); }
.footer-divider { width: 60px; height: 1px; background: var(--glass-border); margin: 0 auto 16px; }
.footer-copy { font-size: 0.75rem; color: var(--text-muted); letter-spacing: 2px; }
@media (max-width: 640px) { .footer-content { flex-direction: column; gap: 16px; } }
</style>
