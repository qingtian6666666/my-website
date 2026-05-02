<template>
  <div class="home">
    <div class="hero-orbs" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>

    <div class="hero">
      <div class="hero-content animate-fadeInUp">
        <div class="avatar-wrapper">
          <div class="avatar-ring"></div>
          <div class="avatar-ring ring-2"></div>
          <div class="avatar"><img src="../assets/avatar.jpg" alt="avatar" /></div>
          <div class="avatar-glow"></div>
        </div>
        <h1 class="hero-title">你好，我是 <span class="highlight">Bob Song</span></h1>
        <p class="hero-subtitle">
          一个热爱技术、追求卓越的
          <span class="tw-wrap">
            <span class="tw-text">{{ displayText }}</span>
            <span class="tw-cursor">|</span>
          </span>
        </p>
        <p class="hero-motto">"代码改变世界，创新驱动未来"</p>
        <div class="hero-actions">
          <router-link to="/about" class="btn-gradient"><span>了解更多</span></router-link>
          <router-link to="/devnotes" class="btn-outline">开发心得</router-link>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat-item" v-for="(stat, i) in stats" :key="stat.label" :style="{ animationDelay: (0.3 + i * 0.15) + 's' }">
          <span class="stat-num">{{ vals[i] }}{{ stat.suffix }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <div class="quick-sections">
      <router-link v-for="(c, i) in cards" :key="c.title" :to="c.path" class="quick-card glass-card scroll-reveal" :style="{ transitionDelay: (i * 0.1) + 's' }">
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

var words = ['全栈开发者', 'AI 爱好者', '开源贡献者', '终身学习者']
var displayText = ref('')
var wIdx = 0, cIdx = 0, del = false, tmr = null

function tick() {
  var w = words[wIdx]
  if (!del) {
    displayText.value = w.substring(0, cIdx + 1)
    cIdx++
    if (cIdx >= w.length) { del = true; tmr = setTimeout(tick, 2000); return }
    tmr = setTimeout(tick, 120)
  } else {
    cIdx--
    displayText.value = w.substring(0, cIdx)
    if (cIdx <= 0) { del = false; wIdx = (wIdx + 1) % words.length; tmr = setTimeout(tick, 500); return }
    tmr = setTimeout(tick, 60)
  }
}

var stats = [
  { value: 3, suffix: '+', label: '年开发经验' },
  { value: 20, suffix: '+', label: '完成项目' },
  { value: 0, suffix: '', label: '学习热情', special: true },
]
var vals = ref(['0', '0', '0'])

function countUp() {
  stats.forEach(function(s, i) {
    if (s.special) { setTimeout(function() { vals.value[i] = '∞' }, 600 + i * 200); return }
    var t0 = performance.now(), target = s.value
    ;(function step(now) {
      var p = Math.min((now - t0) / 1200, 1)
      vals.value[i] = String(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(step)
    })(t0)
    setTimeout(function() { requestAnimationFrame(step) }, 400 + i * 200)
  })
}

var cards = [
  { path: '/about', icon: '👤', title: '关于我', desc: '了解我的技术栈与经历', glow: 'radial-gradient(circle, rgba(102,126,234,0.3), transparent)' },
  { path: '/vision', icon: '🚀', title: '未来展望', desc: '对技术与职业的规划', glow: 'radial-gradient(circle, rgba(240,147,251,0.3), transparent)' },
  { path: '/music', icon: '🎵', title: '音乐空间', desc: '轻音乐与助眠白噪音', glow: 'radial-gradient(circle, rgba(94,231,223,0.3), transparent)' },
  { path: '/devnotes', icon: '📝', title: '开发心得', desc: '记录编程路上的感悟', glow: 'radial-gradient(circle, rgba(118,75,162,0.3), transparent)' },
]

onMounted(function() { tick(); countUp() })
onUnmounted(function() { if (tmr) clearTimeout(tmr) })
</script>

<style scoped>
.home { min-height: 100vh; position: relative; }

.hero-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12; animation: orbFloat 20s ease-in-out infinite; }
.orb-1 { width: 500px; height: 500px; background: #667eea; top: -10%; left: -5%; }
.orb-2 { width: 400px; height: 400px; background: #f093fb; bottom: 10%; right: -10%; animation-delay: -7s; }
@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -40px) scale(1.05); }
  50% { transform: translate(-20px, 20px) scale(0.95); }
  75% { transform: translate(40px, 30px) scale(1.03); }
}

.hero { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 0 24px; position: relative; z-index: 1; }
.hero-content { max-width: 700px; }

.avatar-wrapper { position: relative; display: inline-block; margin-bottom: 32px; }
.avatar { width: 120px; height: 120px; border-radius: 50%; overflow: hidden; position: relative; z-index: 2; border: 3px solid rgba(102,126,234,0.4); }
.avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.avatar-ring { position: absolute; inset: -12px; border-radius: 50%; border: 1px solid rgba(102,126,234,0.3); animation: ringRot 8s linear infinite; z-index: 1; }
.avatar-ring::before { content: ''; position: absolute; top: -3px; left: 50%; width: 6px; height: 6px; background: var(--accent-1); border-radius: 50%; box-shadow: 0 0 10px var(--accent-1); }
.ring-2 { inset: -24px; border-color: rgba(240,147,251,0.15); animation: ringRot 12s linear infinite reverse; }
.ring-2::before { background: var(--accent-3); box-shadow: 0 0 10px var(--accent-3); }
@keyframes ringRot { to { transform: rotate(360deg); } }
.avatar-glow { position: absolute; inset: -20px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-1), var(--accent-3)); opacity: 0.2; filter: blur(25px); animation: pulse 3s ease-in-out infinite; z-index: 0; }

.hero-title { font-size: 3rem; font-weight: 800; margin-bottom: 16px; line-height: 1.2; }
.highlight { background: linear-gradient(135deg, var(--accent-1), var(--accent-3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-subtitle { font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 12px; min-height: 1.6em; }
.tw-wrap { display: inline-block; color: var(--accent-4); font-weight: 600; }
.tw-cursor { display: inline-block; color: var(--accent-1); animation: blink 0.8s step-end infinite; margin-left: 1px; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.hero-motto { font-size: 1.05rem; color: var(--text-muted); font-style: italic; margin-bottom: 36px; }

.hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.btn-outline { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border: 1px solid var(--glass-border); color: var(--text-primary); border-radius: 50px; font-size: 1rem; font-weight: 600; text-decoration: none; transition: var(--transition); }
.btn-outline:hover { border-color: var(--accent-1); background: rgba(102,126,234,0.1); transform: translateY(-2px); }

.hero-stats { display: flex; gap: 56px; margin-top: 72px; }
.stat-item { text-align: center; opacity: 0; animation: fadeInUp 0.6s ease forwards; }
.stat-num { display: block; font-size: 2.2rem; font-weight: 800; background: linear-gradient(135deg, var(--accent-1), var(--accent-4)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.stat-label { font-size: 0.85rem; color: var(--text-muted); margin-top: 6px; }

.quick-sections { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 1200px; margin: -40px auto 80px; padding: 0 24px; position: relative; z-index: 1; }
.quick-card { padding: 36px 24px 28px; text-align: center; text-decoration: none; color: var(--text-primary); position: relative; overflow: hidden; }
.qc-icon-wrap { position: relative; display: inline-block; margin-bottom: 18px; }
.qc-icon { font-size: 2.5rem; position: relative; z-index: 1; transition: transform 0.3s ease; }
.quick-card:hover .qc-icon { transform: scale(1.15); }
.qc-glow { position: absolute; inset: -20px; border-radius: 50%; opacity: 0; transition: opacity 0.3s ease; z-index: 0; }
.quick-card:hover .qc-glow { opacity: 1; }
.quick-card h3 { font-size: 1.15rem; margin-bottom: 8px; font-weight: 600; }
.quick-card p { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 12px; }
.qc-arrow { display: inline-block; color: var(--accent-1); font-size: 1.1rem; opacity: 0; transform: translateX(-8px); transition: all 0.3s ease; }
.quick-card:hover .qc-arrow { opacity: 1; transform: translateX(0); }

@media (max-width: 768px) {
  .hero-title { font-size: 2rem; }
  .hero-subtitle { font-size: 1.05rem; }
  .hero-stats { gap: 32px; margin-top: 52px; }
  .stat-num { font-size: 1.5rem; }
  .quick-sections { grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 32px; }
  .avatar { width: 90px; height: 90px; font-size: 2.2rem; }
  .orb { display: none; }
}
@media (max-width: 480px) {
  .hero-title { font-size: 1.6rem; }
  .quick-sections { grid-template-columns: 1fr; }
  .hero-stats { gap: 24px; }
}
</style>
