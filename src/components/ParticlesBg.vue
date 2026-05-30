<template>
  <canvas ref="canvas" class="particles-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let animId = null
let paused = false

onMounted(() => {
  const cvs = canvas.value
  if (!cvs) return
  const ctx = cvs.getContext('2d')
  if (!ctx) return

  // 根据屏幕宽度和 CPU 核心数自适应粒子数量
  const w = window.innerWidth
  const cores = navigator.hardwareConcurrency || 4
  let STAR_COUNT = 180
  if (w < 768 || cores <= 2) STAR_COUNT = 60
  else if (w < 1200 || cores <= 4) STAR_COUNT = 80

  const MOUSE_R = 150
  let stars = []
  let shootingStars = []
  let mouse = { x: -9999, y: -9999 }
  let lastShoot = 0
  // 视差偏移（反向随动）
  let parallaxX = 0, parallaxY = 0
  let targetPX = 0, targetPY = 0

  function resize() {
    cvs.width = window.innerWidth
    cvs.height = window.innerHeight
  }

  function makeStars() {
    stars = []
    for (let i = 0; i < STAR_COUNT; i++) {
      const x = Math.random() * cvs.width
      const y = Math.random() * cvs.height
      stars.push({
        x, y, ox: x, oy: y,
        r: Math.random() * 1.8 + 0.3,
        a: Math.random(),
        da: (Math.random() - 0.5) * 0.012,
        sp: Math.random() * 0.25 + 0.03,
        vx: 0, vy: 0,
        layer: Math.random(), // 0-1, 用于视差深度
      })
    }
  }

  function shoot(ts) {
    shootingStars.push({
      x: Math.random() * cvs.width, y: -10,
      len: 80 + Math.random() * 60,
      sp: 4 + Math.random() * 3,
      ang: Math.PI / 4 + Math.random() * Math.PI / 6,
      a: 1, decay: 0.015 + Math.random() * 0.01,
    })
    lastShoot = ts
  }

  function drawBg() {
    // 背景光晕跟随鼠标（微弱）
    if (mouse.x > 0) {
      const gm = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_R * 2)
      gm.addColorStop(0, 'rgba(168,85,247,0.04)')
      gm.addColorStop(0.4, 'rgba(6,182,212,0.02)')
      gm.addColorStop(1, 'transparent')
      ctx.fillStyle = gm
      ctx.fillRect(0, 0, cvs.width, cvs.height)
    }
  }

  function frame(ts) {
    if (paused) { animId = requestAnimationFrame(frame); return }
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    drawBg()

    if (ts - lastShoot > 5000 + Math.random() * 5000) shoot(ts)

    // 平滑插值视差偏移
    parallaxX += (targetPX - parallaxX) * 0.05
    parallaxY += (targetPY - parallaxY) * 0.05

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i]
      s.a += s.da
      if (s.a <= 0.1 || s.a >= 1) s.da *= -1
      s.a = Math.max(0.1, Math.min(1, s.a))

      s.oy -= s.sp
      if (s.oy < -5) { s.oy = cvs.height + 5; s.ox = Math.random() * cvs.width }

      // 鼠标排斥力
      const dx = mouse.x - s.ox
      const dy = mouse.y - s.oy
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < MOUSE_R && d > 0) {
        const f = (1 - d / MOUSE_R) * 0.5
        s.vx += (dx / d) * f
        s.vy += (dy / d) * f
      }
      s.vx += (s.ox - s.x) * 0.02
      s.vy += (s.oy - s.y) * 0.02
      s.vx *= 0.92
      s.vy *= 0.92
      s.x += s.vx
      s.y += s.vy

      // 视差：不同层的星星偏移量不同
      const px = parallaxX * s.layer * 0.6
      const py = parallaxY * s.layer * 0.6

      ctx.beginPath()
      ctx.arc(s.x + px, s.y + py, s.r, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(200,210,255,' + s.a + ')'
      ctx.fill()

      // 大星星光晕
      if (s.r > 1.3) {
        ctx.beginPath()
        ctx.arc(s.x + px, s.y + py, s.r * 3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(168,85,247,' + (s.a * 0.06) + ')'
        ctx.fill()
      }
    }

    // 流星
    for (let j = shootingStars.length - 1; j >= 0; j--) {
      const ss = shootingStars[j]
      ss.x += Math.cos(ss.ang) * ss.sp
      ss.y += Math.sin(ss.ang) * ss.sp
      ss.a -= ss.decay
      if (ss.a <= 0) { shootingStars.splice(j, 1); continue }

      const tx = ss.x - Math.cos(ss.ang) * ss.len
      const ty = ss.y - Math.sin(ss.ang) * ss.len
      const gr = ctx.createLinearGradient(tx, ty, ss.x, ss.y)
      gr.addColorStop(0, 'rgba(168,85,247,0)')
      gr.addColorStop(1, 'rgba(6,182,212,' + ss.a + ')')
      ctx.strokeStyle = gr
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(tx, ty)
      ctx.lineTo(ss.x, ss.y)
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,' + ss.a + ')'
      ctx.fill()
    }

    animId = requestAnimationFrame(frame)
  }

  function onMove(e) {
    mouse.x = e.clientX
    mouse.y = e.clientY
    // 反向视差：鼠标向左 -> 星空向右
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    targetPX = -(e.clientX - cx) / cx * 15
    targetPY = -(e.clientY - cy) / cy * 15
  }

  function onLeave() {
    mouse.x = -9999
    mouse.y = -9999
    targetPX = 0
    targetPY = 0
  }

  resize()
  makeStars()
  animId = requestAnimationFrame(frame)

  // 提取 resize handler 为具名函数，便于清理
  const onResize = () => { resize(); makeStars() }
  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('mouseleave', onLeave)

  // 可见性检测：切到后台时暂停动画
  const onVisibility = () => { paused = document.hidden }
  document.addEventListener('visibilitychange', onVisibility)

  onUnmounted(() => {
    if (animId) cancelAnimationFrame(animId)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseleave', onLeave)
    document.removeEventListener('visibilitychange', onVisibility)
  })
})
</script>

<style scoped>
.particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  will-change: transform;
}
</style>
