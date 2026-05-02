<template>
  <div class="page-container">
    <div class="section-header scroll-reveal">
      <h1 class="page-title">关于我</h1>
      <p class="page-subtitle">了解我的技术世界与成长经历</p>
    </div>

    <div class="profile-section scroll-reveal-scale">
      <div class="profile-card glass-card">
        <div class="profile-avatar"><img src="../assets/avatar.jpg" alt="avatar" /></div>
        <div class="profile-info">
          <h2>Bob Song</h2>
          <p class="role">全栈开发工程师</p>
          <p class="bio">热爱编程，享受用代码解决问题的过程。专注于 Web 全栈开发，对前沿技术保持好奇心，相信技术可以改变生活。</p>
          <div class="profile-tags">
            <span class="tag" v-for="t in tags" :key="t">{{ t }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="motto-section scroll-reveal-scale" style="transition-delay:0.1s">
      <div class="motto-card glass-card">
        <div class="motto-mark">"</div>
        <p class="motto-text">保持学习，保持好奇，保持谦逊。写出优雅的代码，做出有价值的产品。</p>
        <div class="motto-mark end">"</div>
      </div>
    </div>

    <div class="tech-section scroll-reveal">
      <h2 class="section-title">技术栈</h2>
      <div class="tech-grid">
        <div class="tech-item glass-card scroll-reveal" v-for="(t, i) in tech" :key="t.name" :style="{ transitionDelay: (i * 0.08) + 's' }">
          <div class="tech-icon">{{ t.icon }}</div>
          <div class="tech-detail">
            <div class="tech-head">
              <span class="tech-name">{{ t.name }}</span>
              <span class="tech-pct">{{ levels[i] }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: levels[i] + '%', background: t.color }"></div>
              <div class="progress-glow" :style="{ width: levels[i] + '%', background: t.color }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="timeline-section scroll-reveal">
      <h2 class="section-title">成长经历</h2>
      <div class="timeline">
        <div class="timeline-item" v-for="(item, i) in timeline" :key="i" :class="i % 2 === 0 ? 'left' : 'right'">
          <div class="timeline-dot" :style="{ background: item.color, boxShadow: '0 0 20px ' + item.color + '40' }">
            <div class="timeline-ping" :style="{ background: item.color }"></div>
          </div>
          <div class="timeline-card glass-card">
            <span class="timeline-date">{{ item.date }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

var tags = ['全栈开发', 'AI 爱好者', '开源贡献者', '持续学习者', '极简主义']

var tech = [
  { name: 'JavaScript / TypeScript', icon: '🟨', level: 90, color: 'linear-gradient(90deg, #f7df1e, #3178c6)' },
  { name: 'Vue.js', icon: '💚', level: 88, color: 'linear-gradient(90deg, #42b883, #35495e)' },
  { name: 'React', icon: '⚛️', level: 80, color: 'linear-gradient(90deg, #61dafb, #0e7fb7)' },
  { name: 'Node.js', icon: '🟩', level: 82, color: 'linear-gradient(90deg, #68a063, #3c873a)' },
  { name: 'Python', icon: '🐍', level: 85, color: 'linear-gradient(90deg, #3776ab, #ffd43b)' },
  { name: 'HTML / CSS', icon: '🎨', level: 92, color: 'linear-gradient(90deg, #e34f26, #264de4)' },
  { name: 'Git & DevOps', icon: '🔧', level: 78, color: 'linear-gradient(90deg, #f05032, #6e5494)' },
  { name: '数据库', icon: '🗄️', level: 75, color: 'linear-gradient(90deg, #4479a1, #47a248)' },
]

var levels = ref(tech.map(function() { return 0 }))
var done = false
var obs = null

var timeline = [
  { date: '2024', title: '深入 AI 领域', desc: '开始探索大语言模型与 AI 应用开发，参与多个 AI 项目。', color: '#f093fb' },
  { date: '2023', title: '全栈开发实践', desc: '独立完成多个全栈项目，掌握前后端一体化开发能力。', color: '#667eea' },
  { date: '2022', title: '前端框架精进', desc: '深入学习 Vue 和 React 生态，参与开源社区。', color: '#5ee7df' },
  { date: '2021', title: '编程之旅起航', desc: '第一次接触编程，从 HTML/CSS 开始，打开了新世界的大门。', color: '#764ba2' },
]

function animateLevels() {
  if (done) return
  done = true
  tech.forEach(function(t, i) {
    var target = t.level, t0 = performance.now()
    ;(function step(now) {
      var p = Math.min((now - t0) / 1500, 1)
      levels.value[i] = Math.round((1 - Math.pow(1 - p, 3)) * target)
      if (p < 1) requestAnimationFrame(step)
    })(t0)
  })
}

onMounted(function() {
  obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) animateLevels() })
  }, { threshold: 0.2 })
  var el = document.querySelector('.tech-section')
  if (el) obs.observe(el)
})

onUnmounted(function() { if (obs) obs.disconnect() })
</script>

<style scoped>
.profile-section { margin-bottom: 48px; }
.profile-card { display: flex; gap: 32px; padding: 40px; align-items: center; overflow: hidden; }
.profile-avatar { width: 100px; height: 100px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 3px solid rgba(102,126,234,0.4); }
.profile-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.profile-info h2 { font-size: 1.8rem; margin-bottom: 4px; }
.role { color: var(--accent-1); font-weight: 500; margin-bottom: 12px; }
.bio { color: var(--text-secondary); margin-bottom: 16px; line-height: 1.8; }
.profile-tags { display: flex; flex-wrap: wrap; gap: 8px; }

.motto-section { margin-bottom: 48px; }
.motto-card { padding: 40px; text-align: center; position: relative; overflow: hidden; }
.motto-mark { font-size: 4rem; line-height: 1; background: linear-gradient(135deg, var(--accent-1), var(--accent-3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; opacity: 0.5; }
.motto-mark.end { text-align: right; }
.motto-text { font-size: 1.3rem; color: var(--text-primary); font-weight: 500; line-height: 2; padding: 0 20px; }

.section-title { font-size: 1.6rem; margin-bottom: 28px; font-weight: 700; background: linear-gradient(135deg, var(--accent-1), var(--accent-3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; display: inline-block; }
.tech-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 48px; }
.tech-item { display: flex; align-items: center; gap: 16px; padding: 20px 24px; }
.tech-icon { font-size: 1.8rem; flex-shrink: 0; }
.tech-detail { flex: 1; }
.tech-head { display: flex; justify-content: space-between; margin-bottom: 8px; }
.tech-name { font-weight: 600; font-size: 0.95rem; }
.tech-pct { color: var(--accent-1); font-weight: 700; font-size: 0.9rem; }
.progress-bar { width: 100%; height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; position: relative; }
.progress-fill { height: 100%; border-radius: 3px; transition: width 0.1s linear; position: relative; z-index: 1; }
.progress-glow { position: absolute; top: -2px; left: 0; height: 10px; border-radius: 5px; filter: blur(4px); opacity: 0.4; z-index: 0; }

.timeline { position: relative; padding: 20px 0; }
.timeline::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, var(--accent-1), var(--accent-3), var(--accent-4)); transform: translateX(-50%); opacity: 0.3; }
.timeline-item { position: relative; width: 50%; padding: 0 40px 40px; }
.timeline-item.left { left: 0; text-align: right; padding-right: 50px; }
.timeline-item.right { left: 50%; padding-left: 50px; }
.timeline-dot { position: absolute; width: 16px; height: 16px; border-radius: 50%; top: 8px; z-index: 1; }
.timeline-ping { position: absolute; inset: 0; border-radius: 50%; animation: dotPing 2s ease-out infinite; opacity: 0; }
@keyframes dotPing { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.5); opacity: 0; } }
.timeline-item.left .timeline-dot { right: -8px; }
.timeline-item.right .timeline-dot { left: -8px; }
.timeline-card { padding: 24px; }
.timeline-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(102,126,234,0.15); }
.timeline-date { display: inline-block; padding: 4px 14px; background: rgba(102,126,234,0.15); color: var(--accent-1); border-radius: 20px; font-size: 0.85rem; font-weight: 600; margin-bottom: 10px; border: 1px solid rgba(102,126,234,0.2); }
.timeline-card h3 { font-size: 1.15rem; margin-bottom: 8px; }
.timeline-card p { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; }

@media (max-width: 768px) {
  .profile-card { flex-direction: column; text-align: center; padding: 30px 24px; }
  .profile-tags { justify-content: center; }
  .tech-grid { grid-template-columns: 1fr; }
  .timeline::before { left: 20px; }
  .timeline-item { width: 100%; padding-left: 50px !important; padding-right: 16px !important; text-align: left !important; }
  .timeline-item.left, .timeline-item.right { left: 0; }
  .timeline-item .timeline-dot { left: 13px !important; right: auto !important; }
  .motto-text { font-size: 1.1rem; }
}
</style>
