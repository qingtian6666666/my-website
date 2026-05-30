import { onMounted, onUnmounted } from 'vue'

/**
 * 动态设置页面 meta 标签（title / description / OG / Twitter Card）
 * @param {Object} meta
 * @param {string} meta.title - 页面标题
 * @param {string} meta.description - 页面描述
 * @param {string} [meta.keywords] - 关键词
 */
export function usePageMeta({ title, description, keywords }) {
  const siteName = 'Bob Song - 个人空间'
  const fullTitle = title ? `${title} | ${siteName}` : siteName

  let prevTitle = ''
  let prevDesc = null
  let prevKeywords = null
  let prevOgTitle = null
  let prevOgDesc = null
  let prevTwTitle = null
  let prevTwDesc = null

  const setOrCreate = (attr, attrValue, content) => {
    let el = document.querySelector(`meta[${attr}="${attrValue}"]`)
    const prev = el ? el.getAttribute('content') : null
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, attrValue)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
    return prev
  }

  onMounted(() => {
    prevTitle = document.title
    document.title = fullTitle

    if (description) {
      prevDesc = setOrCreate('name', 'description', description)
    }
    if (keywords) {
      prevKeywords = setOrCreate('name', 'keywords', keywords)
    }

    // Open Graph
    prevOgTitle = setOrCreate('property', 'og:title', fullTitle)
    if (description) {
      prevOgDesc = setOrCreate('property', 'og:description', description)
    }

    // Twitter Card
    prevTwTitle = setOrCreate('name', 'twitter:title', fullTitle)
    if (description) {
      prevTwDesc = setOrCreate('name', 'twitter:description', description)
    }
  })

  onUnmounted(() => {
    document.title = prevTitle
    if (prevDesc !== null) setOrCreate('name', 'description', prevDesc)
    if (prevKeywords !== null) setOrCreate('name', 'keywords', prevKeywords)
    if (prevOgTitle !== null) setOrCreate('property', 'og:title', prevOgTitle)
    if (prevOgDesc !== null) setOrCreate('property', 'og:description', prevOgDesc)
    if (prevTwTitle !== null) setOrCreate('name', 'twitter:title', prevTwTitle)
    if (prevTwDesc !== null) setOrCreate('name', 'twitter:description', prevTwDesc)
  })
}
