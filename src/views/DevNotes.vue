<template>
  <div class="page-container">
    <div class="section-header scroll-reveal">
      <h1 class="page-title">开发心得</h1>
      <p class="page-subtitle">记录编程路上的思考与感悟，随时修改，实时保存</p>
    </div>

    <div class="notes-toolbar scroll-reveal" style="transition-delay:0.1s">
      <button class="btn-neon btn-neon-fill" @click="openNew"><span>✦ 写新心得</span></button>
      <span class="notes-count">共 {{ notes.length }} 篇心得</span>
    </div>

    <!-- 文章详情视图 -->
    <div v-if="viewingNote" class="note-detail glass-card scroll-reveal-scale">
      <div class="nd-header">
        <button class="nd-back" @click="viewingNote = null">← 返回列表</button>
        <div class="nd-tags"><span class="tag" v-for="t in viewingNote.tags" :key="t">{{ t }}</span></div>
      </div>
      <h2 class="nd-title">{{ viewingNote.title }}</h2>
      <div class="nd-meta">
        <span class="nd-date">{{ viewingNote.date }}</span>
      </div>
      <div class="nd-body" v-html="renderDetail(viewingNote.content)"></div>
    </div>

    <!-- 列表视图 -->
    <template v-else>
      <div class="notes-grid" v-if="notes.length">
        <NoteCard
          v-for="note in notes"
          :key="note.id"
          :note="note"
          class="scroll-reveal"
          @click="viewNote(note)"
          @edit="openEdit(note)"
          @delete="deleteNote(note.id)"
        />
      </div>

      <div class="notes-empty glass-card scroll-reveal-scale" v-else>
        <div class="empty-icon">📝</div>
        <p>还没有心得，点击上方按钮开始记录吧！</p>
      </div>
    </template>

    <NoteEditor v-if="showEditor" :note="editingNote" @save="saveNote" @close="showEditor = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import NoteCard from '../components/NoteCard.vue'
import NoteEditor from '../components/NoteEditor.vue'
import { renderMarkdown } from '../utils/markdown.js'
import { sanitizeHTML } from '../utils/sanitize.js'
import { isValidNote, safeLoadFromStorage } from '../utils/validators.js'
import { usePageMeta } from '../composables/usePageMeta.js'

usePageMeta({
  title: '开发心得',
  description: '记录编程路上的思考与感悟。',
})

const KEY = 'my-website-dev-notes'
const notes = ref([])
const showEditor = ref(false)
const editingNote = ref(null)
const viewingNote = ref(null)

const defaults = [
  {
    id: 1,
    title: '关于 Vue 3 Composition API 的思考',
    content: '从 Options API 转到 Composition API，最大的感受是逻辑复用变得更加优雅。以前需要 mixin 或者高阶组件才能实现的复用，现在通过 composable 函数就能干净地完成。\n\n特别是 ref 和 reactive 的设计，虽然刚开始需要适应 .value 的写法，但习惯之后会发现代码的可读性和可维护性都提升了很多。\n\n建议新项目直接使用 Composition API + script setup 的方式，开发体验真的很棒。\n\n```js\n// 一个简单的 composable\nexport function useCountUp(target) {\n  const value = ref(0)\n  const start = () => {\n    const t0 = performance.now()\n    const step = (now) => {\n      const p = Math.min((now - t0) / 1200, 1)\n      value.value = Math.round(p * target)\n      if (p < 1) requestAnimationFrame(step)\n    }\n    requestAnimationFrame(step)\n  }\n  return { value, start }\n}\n```',
    tags: ['Vue', '前端', '架构'],
    date: '2024/03/15',
  },
  {
    id: 2,
    title: '代码整洁之道 - 实践感悟',
    content: '最近重读了《代码整洁之道》，结合实际项目有了更深的体会：\n\n1. 函数应该只做一件事，并且做好。如果一个函数超过20行，大概率可以拆分。\n2. 好的命名胜过注释。变量名要能表达意图，而不只是描述数据类型。\n3. 不要过度设计。YAGNI 原则很重要。\n4. 单元测试不是负担，而是信心的来源。写测试让你敢于重构。\n\n```python\ndef calculate_total(items):\n    """计算订单总额"""\n    return sum(item.price * item.quantity for item in items)\n```',
    tags: ['编程思想', '代码质量'],
    date: '2024/02/28',
  },
  {
    id: 3,
    title: '第一次部署线上项目的踩坑记录',
    content: '部署看起来简单，实际上有很多细节要注意：\n\n- 环境变量一定要分离，不要把密钥写在代码里\n- CORS 问题在本地不会出现，上线后才暴露\n- Nginx 配置 SPA 的 try_files 很关键\n- HTTPS 证书可以用 Let\'s Encrypt 免费申请\n- 日志收集和错误监控从第一天就要做\n\n```nginx\nserver {\n    listen 80;\n    server_name example.com;\n    root /var/www/dist;\n    \n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n}\n```',
    tags: ['DevOps', '部署', '踩坑'],
    date: '2024/01/10',
  },
]

const load = () => {
  const validated = safeLoadFromStorage(KEY, isValidNote)
  if (validated.length > 0) { notes.value = validated }
  else { notes.value = defaults.slice(); save() }
}
const save = () => { localStorage.setItem(KEY, JSON.stringify(notes.value)) }
const openNew = () => { editingNote.value = null; showEditor.value = true }
const openEdit = (n) => { editingNote.value = Object.assign({}, n); showEditor.value = true }
const viewNote = (n) => { viewingNote.value = n }
const saveNote = (d) => {
  const i = notes.value.findIndex((n) => n.id === d.id)
  if (i >= 0) notes.value[i] = d; else notes.value.unshift(d)
  save(); showEditor.value = false
}
const deleteNote = (id) => { notes.value = notes.value.filter((n) => n.id !== id); save() }

// 详情渲染：markdown + 消毒
const renderDetail = (text) => sanitizeHTML(renderMarkdown(text))

onMounted(load)
watch(notes, save, { deep: true })
</script>

<style scoped>
.notes-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
.notes-count { font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono); letter-spacing: 1px; }
.notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; margin-bottom: 40px; }
.notes-empty { padding: 60px 24px; text-align: center; font-size: 1.1rem; color: var(--text-secondary); }
.empty-icon { font-size: 3rem; margin-bottom: 16px; opacity: 0.6; }

/* 文章详情 */
.note-detail { padding: 40px; margin-bottom: 40px; }
.nd-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.nd-back {
  background: none;
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  padding: 6px 16px;
  border-radius: var(--radius);
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-sans);
}
.nd-back:hover { border-color: var(--neon-purple); color: var(--neon-purple); }
.nd-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.nd-title { font-size: 1.8rem; font-weight: 700; margin-bottom: 12px; letter-spacing: 1px; background: linear-gradient(135deg, var(--neon-purple), var(--neon-cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.nd-meta { margin-bottom: 28px; }
.nd-date { font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono); }
.nd-body {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 2;
  font-weight: 300;
}

.nd-body :deep(.code-block) {
  background: #0d1117;
  border: 1px solid rgba(168, 85, 247, 0.15);
  border-radius: var(--radius);
  padding: 20px 24px;
  font-family: var(--font-mono);
  font-size: 0.88rem;
  line-height: 1.8;
  color: #c9d1d9;
  margin: 20px 0;
  overflow-x: auto;
  animation: codeGlow 4s ease-in-out infinite;
}

.nd-body :deep(.inline-code) {
  background: rgba(168, 85, 247, 0.1);
  color: var(--neon-purple);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.88em;
  border: 1px solid rgba(168, 85, 247, 0.15);
}

@keyframes codeGlow {
  0%, 100% { box-shadow: 0 0 15px rgba(168, 85, 247, 0.08), inset 0 0 15px rgba(168, 85, 247, 0.03); }
  50% { box-shadow: 0 0 25px rgba(168, 85, 247, 0.15), inset 0 0 25px rgba(168, 85, 247, 0.05); }
}

@media (max-width: 480px) {
  .notes-grid { grid-template-columns: 1fr; }
  .notes-toolbar { flex-direction: column; gap: 12px; align-items: flex-start; }
  .note-detail { padding: 24px; }
  .nd-title { font-size: 1.4rem; }
}
</style>
