/**
 * 简易 Markdown 渲染：代码块 + 行内代码 + 换行
 * @param {string} text - 原始文本
 * @returns {string} 渲染后的 HTML
 */
export function renderMarkdown(text) {
  if (!text) return ''
  // 转义 HTML
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  // 代码块：```...```
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, _lang, code) => {
    return `<pre class="code-block"><code>${code.trim()}</code></pre>`
  })
  // 行内代码：`...`
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
  // 换行
  html = html.replace(/\n/g, '<br>')
  return html
}
