import { onMounted, onUnmounted } from 'vue'

/**
 * 模态框焦点陷阱
 * @param {import('vue').Ref<HTMLElement>} containerRef - 容器元素 ref
 * @param {Object} options
 * @param {Function} [options.onEscape] - Escape 键回调
 */
export function useFocusTrap(containerRef, { onEscape } = {}) {
  let previousActive = null

  const getFocusable = () => {
    const el = containerRef.value
    if (!el) return []
    return Array.from(
      el.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    )
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onEscape?.()
      return
    }

    if (e.key !== 'Tab') return

    const focusable = getFocusable()
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  onMounted(() => {
    previousActive = document.activeElement
    document.addEventListener('keydown', onKeyDown)
    // 自动聚焦第一个可聚焦元素
    setTimeout(() => {
      const focusable = getFocusable()
      if (focusable.length > 0) focusable[0].focus()
    }, 50)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', onKeyDown)
    // 恢复焦点
    if (previousActive && previousActive.focus) {
      previousActive.focus()
    }
  })
}
