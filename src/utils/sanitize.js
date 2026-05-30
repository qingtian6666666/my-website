import DOMPurify from 'dompurify'

/**
 * 安全的 HTML 消毒函数
 * 仅允许基础文本格式标签，防止 XSS
 * @param {string} html - 待消毒的 HTML 字符串
 * @returns {string} 消毒后的安全 HTML
 */
export function sanitizeHTML(html) {
  if (!html) return ''
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['pre', 'code', 'br', 'span', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
  })
}
