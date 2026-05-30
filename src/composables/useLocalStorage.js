import { ref, watch } from 'vue'

/**
 * localStorage 响应式封装
 * @param {string} key - 存储键名
 * @param {*} defaultValue - 默认值
 * @param {Function} [validator] - 可选的值验证函数
 * @returns {{ data: Ref, save: Function, load: Function }}
 */
export function useLocalStorage(key, defaultValue, validator) {
  const data = ref(defaultValue)

  const load = () => {
    try {
      const raw = localStorage.getItem(key)
      if (raw !== null) {
        const parsed = JSON.parse(raw)
        data.value = validator ? (validator(parsed) ? parsed : defaultValue) : parsed
      }
    } catch {
      data.value = defaultValue
    }
  }

  const save = () => {
    try {
      localStorage.setItem(key, JSON.stringify(data.value))
    } catch { /* 存储满或不可用时静默失败 */ }
  }

  // 初始化加载
  load()

  // 深度监听自动保存
  watch(data, save, { deep: true })

  return { data, save, load }
}
