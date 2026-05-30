<template>
  <div class="project-card glass-card card-3d" @mousemove="onMouseMove" @mouseleave="onMouseLeave" ref="cardEl">
    <div class="pc-header">
      <div class="pc-icon-wrap">
        <div class="pc-icon">{{ project.featured ? '⭐' : '📁' }}</div>
      </div>
      <div class="pc-links">
        <a v-if="project.github" :href="project.github" target="_blank" rel="noopener" class="pc-link" title="GitHub">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        </a>
        <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener" class="pc-link" title="在线演示">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
    </div>

    <h3 class="pc-title">{{ project.title }}</h3>
    <p class="pc-desc">{{ project.description }}</p>

    <div class="pc-tags">
      <span class="tag" v-for="tag in project.tags" :key="tag">{{ tag }}</span>
    </div>

    <div class="pc-shine" ref="shineEl"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  project: { type: Object, required: true },
})

const cardEl = ref(null)
const shineEl = ref(null)

const onMouseMove = (e) => {
  const card = cardEl.value
  if (!card) return
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = ((y - centerY) / centerY) * -8
  const rotateY = ((x - centerX) / centerX) * 8
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`

  if (shineEl.value) {
    shineEl.value.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(102,126,234,0.15), transparent 60%)`
  }
}

const onMouseLeave = () => {
  const card = cardEl.value
  if (!card) return
  card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'
  if (shineEl.value) {
    shineEl.value.style.background = 'transparent'
  }
}
</script>

<style scoped>
.project-card {
  padding: 28px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: default;
}
.project-card:hover {
  box-shadow: 0 16px 48px rgba(102, 126, 234, 0.2);
}
.pc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}
.pc-icon-wrap {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(102, 126, 234, 0.1);
  font-size: 1.5rem;
}
.pc-links {
  display: flex;
  gap: 8px;
}
.pc-link {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  transition: var(--transition);
  text-decoration: none;
}
.pc-link:hover {
  background: rgba(102, 126, 234, 0.15);
  border-color: var(--accent-1);
  color: var(--accent-1);
  transform: translateY(-2px);
}
.pc-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  font-weight: 600;
}
.pc-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: 16px;
}
.pc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pc-shine {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: background 0.3s ease;
  z-index: 0;
  border-radius: inherit;
}
</style>
