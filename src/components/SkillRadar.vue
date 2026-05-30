<template>
  <div class="radar-wrapper">
    <canvas ref="canvasEl" width="300" height="300" role="img" aria-label="技能雷达图"></canvas>
    <ul class="sr-only">
      <li v-for="d in dimensions" :key="d.label">{{ d.label }}: {{ d.value }}%</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  dimensions: { type: Array, required: true },
})

const canvasEl = ref(null)
const animatedValues = ref([])

const draw = () => {
  const canvas = canvasEl.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const size = 300
  canvas.width = size * dpr
  canvas.height = size * dpr
  canvas.style.width = size + 'px'
  canvas.style.height = size + 'px'
  ctx.scale(dpr, dpr)

  const cx = size / 2
  const cy = size / 2
  const maxR = 110
  const n = props.dimensions.length
  const angleStep = (Math.PI * 2) / n
  const startAngle = -Math.PI / 2

  ctx.clearRect(0, 0, size, size)

  // 绘制网格
  for (let ring = 1; ring <= 5; ring++) {
    const r = (maxR / 5) * ring
    ctx.beginPath()
    for (let i = 0; i <= n; i++) {
      const angle = startAngle + i * angleStep
      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = 'rgba(102, 126, 234, 0.12)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // 绘制轴线
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR)
    ctx.strokeStyle = 'rgba(102, 126, 234, 0.08)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // 绘制数据区域
  ctx.beginPath()
  for (let i = 0; i <= n; i++) {
    const idx = i % n
    const angle = startAngle + idx * angleStep
    const val = (animatedValues.value[idx] || 0) / 100
    const x = cx + Math.cos(angle) * maxR * val
    const y = cy + Math.sin(angle) * maxR * val
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = 'rgba(102, 126, 234, 0.15)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(102, 126, 234, 0.6)'
  ctx.lineWidth = 2
  ctx.stroke()

  // 绘制数据点
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep
    const val = (animatedValues.value[i] || 0) / 100
    const x = cx + Math.cos(angle) * maxR * val
    const y = cy + Math.sin(angle) * maxR * val
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = props.dimensions[i]?.color || '#667eea'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  // 绘制标签
  ctx.font = '12px -apple-system, sans-serif'
  ctx.fillStyle = '#a0a0cc'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep
    const labelR = maxR + 22
    let x = cx + Math.cos(angle) * labelR
    let y = cy + Math.sin(angle) * labelR
    ctx.fillText(props.dimensions[i]?.label || '', x, y)
  }
}

const animateIn = () => {
  const targets = props.dimensions.map(d => d.value)
  animatedValues.value = targets.map(() => 0)
  const duration = 1200
  const t0 = performance.now()
  const easing = (p) => 1 - Math.pow(1 - p, 3)

  const step = (now) => {
    const p = Math.min((now - t0) / duration, 1)
    animatedValues.value = targets.map(t => Math.round(easing(p) * t))
    draw()
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  // 使用 IntersectionObserver 触发动画
  const canvas = canvasEl.value
  if (!canvas) return
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateIn()
      obs.disconnect()
    }
  }, { threshold: 0.3 })
  obs.observe(canvas)
})

watch(() => props.dimensions, draw, { deep: true })
</script>

<style scoped>
.radar-wrapper {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}
canvas {
  max-width: 100%;
}
</style>
