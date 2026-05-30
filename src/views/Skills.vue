<template>
  <div class="page-container">
    <div class="section-header scroll-reveal">
      <h1 class="page-title">技能图谱</h1>
      <p class="page-subtitle">可视化展示我的技术能力分布</p>
    </div>

    <div class="skills-top">
      <div class="radar-section glass-card scroll-reveal-scale">
        <h3 class="radar-title">技能雷达</h3>
        <SkillRadar :dimensions="radarDimensions" />
      </div>

      <div class="skills-summary glass-card scroll-reveal-scale" style="transition-delay:0.15s">
        <h3 class="summary-title">核心能力</h3>
        <div class="summary-items">
          <div class="summary-item" v-for="d in radarDimensions" :key="d.label">
            <span class="si-label">{{ d.label }}</span>
            <div class="si-bar">
              <div class="si-fill" :style="{ width: d.value + '%', background: d.color }"></div>
            </div>
            <span class="si-val">{{ d.value }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="skill-tabs scroll-reveal" style="transition-delay:0.2s">
      <button
        v-for="(cat, key) in categories"
        :key="key"
        class="tab-btn"
        :class="{ active: activeTab === key }"
        @click="activeTab = key"
        :aria-pressed="activeTab === key"
      >{{ cat }}</button>
    </div>

    <div class="skill-list">
      <SkillBar
        v-for="(skill, i) in currentSkills"
        :key="skill.name"
        :skill="skill"
        class="scroll-reveal"
        :style="{ transitionDelay: (i * 0.06) + 's' }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SkillRadar from '../components/SkillRadar.vue'
import SkillBar from '../components/SkillBar.vue'
import { usePageMeta } from '../composables/usePageMeta.js'

usePageMeta({
  title: '技能图谱',
  description: '可视化展示 Bob Song 的技术能力分布。',
})

const radarDimensions = [
  { label: '前端开发', value: 92, color: '#667eea' },
  { label: '后端开发', value: 80, color: '#5ee7df' },
  { label: 'UI 设计', value: 70, color: '#f093fb' },
  { label: '数据库', value: 75, color: '#764ba2' },
  { label: 'DevOps', value: 68, color: '#f093fb' },
  { label: 'AI/ML', value: 60, color: '#667eea' },
]

const categories = {
  frontend: '前端',
  backend: '后端',
  tools: '工具链',
}

const skillsData = {
  frontend: [
    { name: 'JavaScript / TypeScript', level: 90, color: 'linear-gradient(90deg, #f7df1e, #3178c6)' },
    { name: 'Vue.js', level: 88, color: 'linear-gradient(90deg, #42b883, #35495e)' },
    { name: 'React', level: 80, color: 'linear-gradient(90deg, #61dafb, #0e7fb7)' },
    { name: 'HTML / CSS', level: 92, color: 'linear-gradient(90deg, #e34f26, #264de4)' },
    { name: 'Tailwind CSS', level: 78, color: 'linear-gradient(90deg, #38bdf8, #0e7490)' },
    { name: '微信小程序', level: 72, color: 'linear-gradient(90deg, #07c160, #06ae56)' },
  ],
  backend: [
    { name: 'Node.js', level: 82, color: 'linear-gradient(90deg, #68a063, #3c873a)' },
    { name: 'Python', level: 85, color: 'linear-gradient(90deg, #3776ab, #ffd43b)' },
    { name: 'MySQL / PostgreSQL', level: 75, color: 'linear-gradient(90deg, #4479a1, #336791)' },
    { name: 'MongoDB', level: 70, color: 'linear-gradient(90deg, #47a248, #3d8b37)' },
    { name: 'Redis', level: 65, color: 'linear-gradient(90deg, #dc382d, #a41e11)' },
    { name: 'RESTful API 设计', level: 82, color: 'linear-gradient(90deg, #667eea, #764ba2)' },
  ],
  tools: [
    { name: 'Git & GitHub', level: 85, color: 'linear-gradient(90deg, #f05032, #6e5494)' },
    { name: 'Docker', level: 72, color: 'linear-gradient(90deg, #2496ed, #1d63a5)' },
    { name: 'Linux / Shell', level: 78, color: 'linear-gradient(90deg, #fcc624, #000)' },
    { name: 'Nginx', level: 70, color: 'linear-gradient(90deg, #009639, #006621)' },
    { name: 'Vite / Webpack', level: 80, color: 'linear-gradient(90deg, #646cff, #535bf2)' },
    { name: 'CI/CD', level: 65, color: 'linear-gradient(90deg, #667eea, #f093fb)' },
  ],
}

const activeTab = ref('frontend')
const currentSkills = computed(() => skillsData[activeTab.value] || [])
</script>

<style scoped>
.skills-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 40px;
}
.radar-section {
  padding: 28px;
  text-align: center;
}
.radar-title, .summary-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-primary);
}
.skills-summary {
  padding: 28px;
}
.summary-items {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.si-label {
  width: 80px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  flex-shrink: 0;
  text-align: right;
}
.si-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
}
.si-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.si-val {
  width: 40px;
  font-size: 0.85rem;
  color: var(--accent-1);
  font-weight: 600;
  text-align: right;
}
.skill-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 28px;
  justify-content: center;
}
.tab-btn {
  padding: 8px 24px;
  border-radius: 50px;
  border: 1px solid var(--glass-border);
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}
.tab-btn:hover {
  border-color: var(--accent-1);
  color: var(--text-primary);
}
.tab-btn.active {
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  color: #fff;
  border-color: transparent;
}
.skill-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
@media (max-width: 768px) {
  .skills-top {
    grid-template-columns: 1fr;
  }
  .skill-list {
    grid-template-columns: 1fr;
  }
}
</style>
