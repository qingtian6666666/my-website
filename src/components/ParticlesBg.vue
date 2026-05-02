<template>
  <canvas ref="canvas" class="particles-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let animId = null

onMounted(() => {
  const cvs = canvas.value
  if (!cvs) return
  const ctx = cvs.getContext('2d')
  if (!ctx) return

  const STAR_COUNT = 160
  const MOUSE_R = 150
  let stars = []
  let shootingStars = []
  let mouse = { x: -9999, y: -9999 }
  let lastShoot = 0

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
        da: (Math.random() - 0.5) * 0.015,
        sp: Math.random() * 0.3 + 0.05,
        vx: 0, vy: 0,
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
    var g1 = ctx.createRadialGradient(cvs.width * 0.3, cvs.height * 0.4, 0, cvs.width * 0.3, cvs.height * 0.4, cvs.width * 0.5)
    g1.addColorStop(0, 'rgba(102,126,234,0.04)')
    g1.addColorStop(1, 'transparent')
    ctx.fillStyle = g1
    ctx.fillRect(0, 0, cvs.width, cvs.height)

    var g2 = ctx.createRadialGradient(cvs.width * 0.7, cvs.height * 0.6, 0, cvs.width * 0.7, cvs.height * 0.6, cvs.width * 0.4)
    g2.addColorStop(0, 'rgba(118,75,162,0.03)')
    g2.addColorStop(1, 'transparent')
    ctx.fillStyle = g2
    ctx.fillRect(0, 0, cvs.width, cvs.height)

    if (mouse.x > 0) {
      var gm = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_R * 1.5)
      gm.addColorStop(0, 'rgba(102,126,234,0.06)')
      gm.addColorStop(0.5, 'rgba(240,147,251,0.03)')
      gm.addColorStop(1, 'transparent')
      ctx.fillStyle = gm
      ctx.fillRect(0, 0, cvs.width, cvs.height)
    }
  }

  function frame(ts) {
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    drawBg()

    if (ts - lastShoot > 5000 + Math.random() * 5000) shoot(ts)

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i]
      s.a += s.da
      if (s.a <= 0.1 || s.a >= 1) s.da *= -1
      s.a = Math.max(0.1, Math.min(1, s.a))

      s.oy -= s.sp
      if (s.oy < -5) { s.oy = cvs.height + 5; s.ox = Math.random() * cvs.width }

      var dx = mouse.x - s.ox
      var dy = mouse.y - s.oy
      var d = Math.sqrt(dx * dx + dy * dy)
      if (d < MOUSE_R && d > 0) {
        var f = (1 - d / MOUSE_R) * 0.6
        s.vx += (dx / d) * f
        s.vy += (dy / d) * f
      }
      s.vx += (s.ox - s.x) * 0.02
      s.vy += (s.oy - s.y) * 0.02
      s.vx *= 0.92
      s.vy *= 0.92
      s.x += s.vx
      s.y += s.vy

      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(200,210,255,' + s.a + ')'
      ctx.fill()

      if (s.r > 1.3) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(102,126,234,' + (s.a * 0.08) + ')'
        ctx.fill()
      }
    }

    for (var j = shootingStars.length - 1; j >= 0; j--) {
      var ss = shootingStars[j]
      ss.x += Math.cos(ss.ang) * ss.sp
      ss.y += Math.sin(ss.ang) * ss.sp
      ss.a -= ss.decay
      if (ss.a <= 0) { shootingStars.splice(j, 1); continue }

      var tx = ss.x - Math.cos(ss.ang) * ss.len
      var ty = ss.y - Math.sin(ss.ang) * ss.len
      var gr = ctx.createLinearGradient(tx, ty, ss.x, ss.y)
      gr.addColorStop(0, 'rgba(200,210,255,0)')
      gr.addColorStop(1, 'rgba(200,210,255,' + ss.a + ')')
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

  function onMove(e) { mouse.x = e.clientX; mouse.y = e.clientY }
  function onLeave() { mouse.x = -9999; mouse.y = -9999 }

  resize()
  makeStars()
  animId = requestAnimationFrame(frame)

  window.addEventListener('resize', function() { resize(); makeStars() })
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseleave', onLeave)

  onUnmounted(function() {
    if (animId) cancelAnimationFrame(animId)
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseleave', onLeave)
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
}
</style>
