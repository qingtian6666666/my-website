import { ref } from 'vue'

const VALID_THEMES = ['dark', 'light']

/**
 * 主题切换 composable
 * 支持 dark / light 两种主题，状态持久化到 localStorage
 */
export function useTheme() {
  const stored = localStorage.getItem('theme')
  const theme = ref(VALID_THEMES.includes(stored) ? stored : 'dark')

  const apply = () => {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', theme.value)
    apply()
  }

  // 初始化应用
  apply()

  return { theme, toggle }
}
