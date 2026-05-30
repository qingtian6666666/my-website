<template>
  <div class="page-container">
    <div class="section-header scroll-reveal">
      <h1 class="page-title">项目作品集</h1>
      <p class="page-subtitle">展示我的开源项目与技术实践</p>
    </div>

    <div class="filter-bar scroll-reveal" style="transition-delay:0.1s">
      <button
        v-for="cat in categories"
        :key="cat"
        class="filter-btn"
        :class="{ active: activeFilter === cat }"
        @click="activeFilter = cat"
        :aria-pressed="activeFilter === cat"
      >{{ cat }}</button>
    </div>

    <div class="projects-grid">
      <ProjectCard
        v-for="(p, i) in filteredProjects"
        :key="p.id"
        :project="p"
        class="scroll-reveal"
        :style="{ transitionDelay: (i * 0.08) + 's' }"
      />
    </div>

    <div class="projects-empty glass-card scroll-reveal-scale" v-if="filteredProjects.length === 0">
      <div class="empty-icon">🔍</div>
      <p>该分类下暂无项目</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProjectCard from '../components/ProjectCard.vue'
import { usePageMeta } from '../composables/usePageMeta.js'

usePageMeta({
  title: '项目作品',
  description: 'Bob Song 的开源项目与技术实践展示。',
})

const projects = [
  {
    id: 1,
    title: '个人网站',
    description: '基于 Vue 3 + Vite 构建的个人空间，包含粒子背景、毛玻璃效果、音乐播放器等功能。',
    tags: ['Vue3', 'Vite', 'CSS3'],
    github: 'https://github.com/qingtian6666666',
    demo: '',
    featured: true,
    category: '前端',
  },
  {
    id: 2,
    title: 'AI 聊天助手',
    description: '基于大语言模型的智能对话应用，支持多轮对话和上下文理解。',
    tags: ['Python', 'FastAPI', 'Vue3'],
    github: 'https://github.com/qingtian6666666',
    demo: '',
    featured: true,
    category: '全栈',
  },
  {
    id: 3,
    title: '任务管理看板',
    description: '拖拽式任务管理工具，支持多列看板视图、标签分类和数据持久化。',
    tags: ['Vue3', 'Drag API', 'LocalStorage'],
    github: 'https://github.com/qingtian6666666',
    demo: '',
    featured: false,
    category: '前端',
  },
  {
    id: 4,
    title: 'Node.js 后端服务',
    description: 'RESTful API 服务，集成 JWT 认证、数据库 ORM 和日志系统。',
    tags: ['Node.js', 'Express', 'MongoDB'],
    github: 'https://github.com/qingtian6666666',
    demo: '',
    featured: false,
    category: '后端',
  },
  {
    id: 5,
    title: '数据可视化面板',
    description: '交互式数据大屏，支持多种图表类型和实时数据更新。',
    tags: ['Vue3', 'Canvas', 'Chart'],
    github: 'https://github.com/qingtian6666666',
    demo: '',
    featured: false,
    category: '前端',
  },
  {
    id: 6,
    title: '自动化部署脚本',
    description: '一键部署工具，支持构建、上传和 Nginx 配置自动化。',
    tags: ['Shell', 'Nginx', 'DevOps'],
    github: 'https://github.com/qingtian6666666',
    demo: '',
    featured: false,
    category: '工具',
  },
]

const categories = ['全部', '前端', '后端', '全栈', '工具']
const activeFilter = ref('全部')

const filteredProjects = computed(() => {
  if (activeFilter.value === '全部') return projects
  return projects.filter(p => p.category === activeFilter.value)
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 32px;
  justify-content: center;
}
.filter-btn {
  padding: 8px 20px;
  border-radius: 50px;
  border: 1px solid var(--glass-border);
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}
.filter-btn:hover {
  border-color: var(--accent-1);
  color: var(--text-primary);
  background: rgba(102, 126, 234, 0.1);
}
.filter-btn.active {
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}
.projects-empty {
  padding: 60px 24px;
  text-align: center;
  font-size: 1.1rem;
  color: var(--text-secondary);
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.6;
}
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
