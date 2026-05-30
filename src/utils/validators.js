/**
 * 验证心得数据结构是否合法
 * @param {unknown} note - 待验证对象
 * @returns {boolean}
 */
export function isValidNote(note) {
  if (!note || typeof note !== 'object') return false
  if (typeof note.id !== 'number' && typeof note.id !== 'string') return false
  if (typeof note.title !== 'string' || note.title.trim().length === 0) return false
  if (typeof note.content !== 'string' || note.content.trim().length === 0) return false
  if (typeof note.date !== 'string') return false
  if (!Array.isArray(note.tags)) return false
  return true
}

/**
 * 安全地从 localStorage 加载并验证数组数据
 * @param {string} key - localStorage 键名
 * @param {Function} validator - 单项验证函数
 * @param {Array} fallback - 验证失败时的默认值
 * @returns {Array}
 */
export function safeLoadFromStorage(key, validator, fallback = []) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return fallback
    return parsed.filter(validator)
  } catch {
    return fallback
  }
}
