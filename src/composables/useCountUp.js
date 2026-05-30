import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 数字递增动画 composable
 * @param {number} target - 目标数值
 * @param {Object} options - 配置项
 * @param {number} options.duration - 动画时长(ms)，默认 1200
 * @param {number} options.delay - 延迟启动(ms)，默认 0
 * @param {boolean} options.immediate - 是否立即开始，默认 false（需手动调用 start）
 */
export function useCountUp(target, options = {}) {
  const { duration = 1200, delay = 0, immediate = false } = options
  const value = ref(0)
  let rafId = null

  const easing = (p) => 1 - Math.pow(1 - p, 3)

  const start = () => {
    if (rafId) return
    const t0 = performance.now()
    const step = (now) => {
      const p = Math.min((now - t0) / duration, 1)
      value.value = Math.round(easing(p) * target)
      if (p < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        rafId = null
      }
    }
    rafId = requestAnimationFrame(step)
  }

  const startWithDelay = () => {
    if (delay > 0) {
      setTimeout(start, delay)
    } else {
      start()
    }
  }

  onMounted(() => {
    if (immediate) startWithDelay()
  })

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
  })

  return { value, start: startWithDelay }
}
