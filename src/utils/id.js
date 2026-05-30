/**
 * 生成唯一 ID
 * 优先使用 crypto.randomUUID，降级到时间戳+随机数
 * @returns {string}
 */
export function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9)
}
