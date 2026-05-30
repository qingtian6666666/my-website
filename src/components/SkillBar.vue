<template>
  <div class="skill-bar-item glass-card">
    <div class="sbi-head">
      <span class="sbi-name">{{ skill.name }}</span>
      <span class="sbi-level">{{ displayLevel }}%</span>
    </div>
    <div class="sbi-track">
      <div class="sbi-fill" ref="fillEl" :style="{ width: displayLevel + '%', background: skill.color }"></div>
      <div class="sbi-glow" :style="{ width: displayLevel + '%', background: skill.color }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCountUp } from '../composables/useCountUp.js'

const props = defineProps({
  skill: { type: Object, required: true },
})

const { value: displayLevel, start: startCountUp } = useCountUp(props.skill.level, { duration: 1200 })
const fillEl = ref(null)
let obs = null

onMounted(() => {
  const el = fillEl.value
  if (!el) return
  obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      startCountUp()
      obs.disconnect()
    }
  }, { threshold: 0.3 })
  obs.observe(el)
})

onUnmounted(() => { if (obs) obs.disconnect() })
</script>

<style scoped>
.skill-bar-item {
  padding: 18px 22px;
}
.sbi-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.sbi-name {
  font-weight: 600;
  font-size: 0.95rem;
}
.sbi-level {
  color: var(--accent-1);
  font-weight: 700;
  font-size: 0.9rem;
}
.sbi-track {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}
.sbi-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.05s linear;
  position: relative;
  z-index: 1;
}
.sbi-glow {
  position: absolute;
  top: -2px;
  left: 0;
  height: 10px;
  border-radius: 5px;
  filter: blur(4px);
  opacity: 0.4;
  z-index: 0;
}
</style>
