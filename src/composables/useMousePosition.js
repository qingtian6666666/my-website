import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 鼠标位置追踪 composable
 * @returns {{ x: Ref<number>, y: Ref<number> }}
 */
export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  const update = (e) => {
    x.value = e.clientX
    y.value = e.clientY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  return { x, y }
}
