<template>
  <div class="home">
    <div class="hero-orbs" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>

    <div class="hero">
      <div class="hero-content animate-fadeInUp">
        <div class="avatar-wrapper" ref="avatarEl" @mousemove="onAvatarMove" @mouseleave="onAvatarLeave">
          <div class="avatar-ring"></div>
          <div class="avatar-ring ring-2"></div>
          <div class="avatar"><img src="../assets/avatar.jpg" alt="Bob Song 的个人头像" /></div>
          <div class="avatar-glow"></div>
        </div>
        <h1 class="hero-title">你好，我是 <span class="highlight">Bob Song</span></h1>
        <p class="hero-subtitle">
          一个热爱技术、追求卓越的
          <span class="tw-wrap" aria-live="polite">
            <span class="tw-text">{{ displayText }}</span>
            <span class="tw-cursor" aria-hidden="true"></span>
          </span>
        </p>
        <div class="motto-capsule">
          <span class="mc-dot"></span>
          <span class="mc-text">代码改变世界，创新驱动未来</span>
        </div>
        <div class="hero-actions">
          <router-link to="/about" class="btn-neon btn-neon-fill"><span>了解更多</span></router-link>
          <router-link to="/devnotes" class="btn-neon"><span>开发心得</span></router-link>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat-item" v-for="(stat, i) in stats" :key="stat.label" :style="{ animationDelay: (0.3 + i * 0.15) + 's' }">
          <span class="stat-num num-mono">{{ vals[i] }}{{ stat.suffix }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <div class="quick-sections">
      <router-link
        v-for="(c, i) in cards"
        :key="c.title"
        :to="c.path"
        class="quick-card glass-card card-3d scroll-reveal"
        :style="{ transitionDelay: (i * 0.08) + 's' }"
        @mousemove="onCardMove($event, c)"
        @mouseleave="onCardLeave($event, c)"
      >
        <div class="qc-border-flow"></div>
        <div class="qc-icon-wrap">
          <div class="qc-icon">{{ c.icon }}</div>
          <div class="qc-glow" :style="{ background: c.glow }"></div>
        </div>
        <h3>{{ c.title }}</h3>
        <p>{{ c.desc }}</p>
        <span class="qc-arrow">&rarr;</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCountUp } from '../composables/useCountUp.js'
import { usePageMeta } from '../composables/usePageMeta.js'

usePageMeta({
  title: '首页',
  description: 'Bob Song的个人空间 - 全栈开发工程师，热爱技术、追求卓越，用代码书写未来。',
  keywords: 'Bob Song, 全栈开发, Vue, React, AI, 个人空间',
})

/* ===== 打字机 ===== */
const words = ['全栈开发者', 'AI 爱好者', '开源贡献者', '终身学习者']
const displayText = ref('')
let wIdx = 0, cIdx = 0, del = false, tmr = null

const tick = () => {
  const w = words[wIdx]
  if (!del) {
    displayText.value = w.substring(0, cIdx + 1)
    cIdx++
    if (cIdx >= w.length) { del = true; tmr = setTimeout(tick, 2200); return }
    tmr = setTimeout(tick, 100)
  } else {
    cIdx--
    displayText.value = w.substring(0, cIdx)
    if (cIdx <= 0) { del = false; wIdx = (wIdx + 1) % words.length; tmr = setTimeout(tick, 400); return }
    tmr = setTimeout(tick, 50)
  }
}

/* ===== 数字递增 ===== */
const stats = [
  { value: 3, suffix: '+', label: '年开发经验' },
  { value: 20, suffix: '+', label: '完成项目' },
  { value: 0, suffix: '', label: '学习热情', special: true },
]
const countUp0 = useCountUp(stats[0].value, { delay: 400 })
const countUp1 = useCountUp(stats[1].value, { delay: 600 })
const vals = ref(['0', '0', '0'])

const countUp = () => {
  countUp0.start()
  countUp1.start()
  const unwatch0 = setInterval(() => { vals.value[0] = String(countUp0.value.value) }, 30)
  const unwatch1 = setInterval(() => { vals.value[1] = String(countUp1.value.value) }, 30)
  setTimeout(() => { clearInterval(unwatch0); clearInterval(unwatch1); vals.value[0] = String(stats[0].value); vals.value[1] = String(stats[1].value) }, 2000)
  setTimeout(() => { vals.value[2] = '∞' }, 800)
}

/* ===== 快捷卡片 ===== */
const cards = [
  { path: '/about', icon: '👤', title: '关于我', desc: '了解我的技术栈与经历', glow: 'radial-gradient(circle, rgba(168,85,247,0.25), transparent)' },
  { path: '/projects', icon: '📂', title: '项目作品', desc: '开源项目与技术实践', glow: 'radial-gradient(circle, rgba(6,182,212,0.25), transparent)' },
  { path: '/skills', icon: '📊', title: '技能图谱', desc: '可视化技术能力分布', glow: 'radial-gradient(circle, rgba(240,147,251,0.25), transparent)' },
  { path: '/vision', icon: '🚀', title: '未来展望', desc: '对技术与职业的规划', glow: 'radial-gradient(circle, rgba(118,75,162,0.25), transparent)' },
  { path: '/music', icon: '🎵', title: '音乐空间', desc: '轻音乐与助眠白噪音', glow: 'radial-gradient(circle, rgba(6,182,212,0.25), transparent)' },
  { path: '/devnotes', icon: '📝', title: '开发心得', desc: '记录编程路上的感悟', glow: 'radial-gradient(circle, rgba(168,85,247,0.25), transparent)' },
  { path: '/contact', icon: '💬', title: '联系我', desc: '期待与你的交流合作', glow: 'radial-gradient(circle, rgba(236,72,153,0.25), transparent)' },
]

/* ===== 3D 视差 ===== */
const onCardMove = (e) => {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const cx = rect.width / 2
  const cy = rect.height / 2
  const rotateX = ((y - cy) / cy) * -6
  const rotateY = ((x - cx) / cx) * 6
  card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`
}

const onCardLeave = (e) => {
  e.currentTarget.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)'
}

const avatarEl = ref(null)
const onAvatarMove = (e) => {
  const el = avatarEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const cx = rect.width / 2
  const cy = rect.height / 2
  const rotateX = ((y - cy) / cy) * -10
  const rotateY = ((x - cx) / cx) * 10
  el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
}

const onAvatarLeave = () => {
  if (avatarEl.value) avatarEl.value.style.transform = 'perspective(600px) rotateX(0) rotateY(0)'
}

onMounted(() => { tick(); countUp() })
onUnmounted(() => { if (tmr) clearTimeout(tmr) })
</script>

<style scoped>
.home { min-height: 100vh; position: relative; }

/* ===== 背景光球 ===== */
.hero-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.1; animation: orbFloat 25s ease-in-out infinite; }
.orb-1 { width: 600px; height: 600px; background: var(--neon-purple); top: -15%; left: -10%; }
.orb-2 { width: 500px; height: 500px; background: var(--neon-cyan); bottom: 10%; right: -15%; animation-delay: -10s; }
@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(40px, -50px) scale(1.05); }
  50% { transform: translate(-30px, 30px) scale(0.95); }
  75% { transform: translate(50px, 40px) scale(1.03); }
}

/* ===== Hero ===== */
.hero { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 0 24px; position: relative; z-index: 1; }
.hero-content { max-width: 720px; }

/* ===== 头像 3D ===== */
.avatar-wrapper { position: relative; display: inline-block; margin-bottom: 36px; transition: transform 0.15s ease-out; transform-style: preserve-3d; will-change: transform; cursor: pointer; }
.avatar { width: 120px; height: 120px; border-radius: 50%; overflow: hidden; position: relative; z-index: 2; border: 2px solid rgba(168, 85, 247, 0.4); box-shadow: 0 0 30px rgba(168, 85, 247, 0.2); }
.avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.avatar-ring { position: absolute; inset: -14px; border-radius: 50%; border: 1px solid rgba(168, 85, 247, 0.2); animation: ringRot 8s linear infinite; z-index: 1; }
.avatar-ring::before { content: ''; position: absolute; top: -3px; left: 50%; width: 5px; height: 5px; background: var(--neon-purple); border-radius: 50%; box-shadow: 0 0 10px var(--neon-purple); }
.ring-2 { inset: -28px; border-color: rgba(6, 182, 212, 0.12); animation: ringRot 14s linear infinite reverse; }
.ring-2::before { background: var(--neon-cyan); box-shadow: 0 0 10px var(--neon-cyan); }
@keyframes ringRot { to { transform: rotate(360deg); } }
.avatar-glow { position: absolute; inset: -25px; border-radius: 50%; background: linear-gradient(135deg, var(--neon-purple), var(--neon-cyan)); opacity: 0.15; filter: blur(30px); animation: pulse 3s ease-in-out infinite; z-index: 0; }

/* ===== 标题 ===== */
.hero-title { font-size: 3.2rem; font-weight: 900; margin-bottom: 20px; line-height: 1.2; }
.highlight { background: linear-gradient(135deg, var(--neon-purple), var(--neon-cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

/* ===== 打字机 ===== */
.hero-subtitle { font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 20px; min-height: 1.6em; font-weight: 300; }
.tw-wrap { display: inline-block; font-weight: 700; font-family: var(--font-mono); }
.tw-text {
  background: linear-gradient(135deg, var(--neon-purple), var(--neon-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: neonBreath 3s ease-in-out infinite;
}
.tw-cursor {
  display: inline-block;
  width: 1.5px;
  height: 1.1em;
  background: var(--neon-cyan);
  vertical-align: text-bottom;
  animation: cursorBlink 0.6s step-end infinite;
  margin-left: 2px;
  box-shadow: 0 0 6px var(--neon-cyan);
}
@keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

/* ===== 座右铭胶囊 ===== */
.motto-capsule { margin-bottom: 36px; }
.mc-dot { display: inline-block; width: 6px; height: 6px; background: var(--neon-purple); border-radius: 50%; margin-right: 10px; box-shadow: 0 0 8px var(--neon-purple); animation: pulse 2s ease-in-out infinite; vertical-align: middle; }

/* ===== 按钮 ===== */
.hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

/* ===== 数字看板 ===== */
.hero-stats { display: flex; gap: 64px; margin-top: 80px; }
.stat-item { text-align: center; opacity: 0; animation: fadeInUp 0.6s ease forwards; }
.stat-num { display: block; font-size: 2.5rem; font-weight: 800; background: linear-gradient(135deg, var(--neon-purple), var(--neon-cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: var(--font-sans); }
.stat-label { font-size: 0.8rem; color: var(--text-muted); margin-top: 8px; font-weight: 300; }

/* ===== 快捷卡片 ===== */
.quick-sections { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1200px; margin: -40px auto 80px; padding: 0 24px; position: relative; z-index: 1; }
.quick-card { padding: 32px 20px 24px; text-align: center; text-decoration: none; color: var(--text-primary); position: relative; overflow: hidden; transform-style: preserve-3d; will-change: transform; }

.qc-border-flow { position: absolute; inset: -1px; border-radius: inherit; background: linear-gradient(135deg, var(--neon-purple), var(--neon-cyan), var(--neon-purple)); background-size: 300% 300%; opacity: 0; transition: opacity 0.4s ease; z-index: -1; animation: borderFlow 4s ease infinite; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: xor; -webkit-mask-composite: xor; padding: 1px; }
.quick-card:hover .qc-border-flow { opacity: 0.7; }

.qc-icon-wrap { position: relative; display: inline-block; margin-bottom: 16px; }
.qc-icon { font-size: 2.2rem; position: relative; z-index: 1; transition: transform 0.3s ease; }
.quick-card:hover .qc-icon { transform: scale(1.2) translateY(-4px); }
.qc-glow { position: absolute; inset: -20px; border-radius: 50%; opacity: 0; transition: opacity 0.3s ease; z-index: 0; }
.quick-card:hover .qc-glow { opacity: 1; }
.quick-card h3 { font-size: 1.05rem; margin-bottom: 6px; font-weight: 600; letter-spacing: 1px; }
.quick-card p { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 10px; font-weight: 300; }
.qc-arrow { display: inline-block; color: var(--neon-purple); font-size: 1.1rem; opacity: 0; transform: translateX(-8px); transition: all 0.3s ease; }
.quick-card:hover .qc-arrow { opacity: 1; transform: translateX(0); text-shadow: 0 0 8px var(--neon-purple); }

@media (max-width: 768px) {
  .hero-title { font-size: 2rem; }
  .hero-subtitle { font-size: 1rem; }
  .hero-stats { gap: 32px; margin-top: 52px; }
  .stat-num { font-size: 1.6rem; }
  .quick-sections { grid-template-columns: repeat(2, 1fr); gap: 14px; margin-top: 32px; }
  .avatar { width: 90px; height: 90px; }
  .orb { display: none; }
}
@media (max-width: 480px) {
  .hero-title { font-size: 1.5rem; }
  .quick-sections { grid-template-columns: 1fr; }
  .hero-stats { gap: 24px; }
}
</style>
