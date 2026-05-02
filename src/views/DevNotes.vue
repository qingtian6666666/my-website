<template>
  <div class="page-container">
    <div class="section-header scroll-reveal">
      <h1 class="page-title">开发心得</h1>
      <p class="page-subtitle">记录编程路上的思考与感悟，随时修改，实时保存</p>
    </div>

    <div class="notes-toolbar scroll-reveal" style="transition-delay:0.1s">
      <button class="btn-gradient" @click="openNew"><span>✦ 写新心得</span></button>
      <span class="notes-count">共 {{ notes.length }} 篇心得</span>
    </div>

    <div class="notes-grid" v-if="notes.length">
      <NoteCard v-for="note in notes" :key="note.id" :note="note" class="scroll-reveal" @edit="openEdit(note)" @delete="deleteNote(note.id)" />
    </div>

    <div class="notes-empty glass-card scroll-reveal-scale" v-else>
      <div class="empty-icon">📝</div>
      <p>还没有心得，点击上方按钮开始记录吧！</p>
    </div>

    <NoteEditor v-if="showEditor" :note="editingNote" @save="saveNote" @close="showEditor = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import NoteCard from '../components/NoteCard.vue'
import NoteEditor from '../components/NoteEditor.vue'

var KEY = 'my-website-dev-notes'
var notes = ref([])
var showEditor = ref(false)
var editingNote = ref(null)

var defaults = [
  { id: 1, title: '关于 Vue 3 Composition API 的思考', content: '从 Options API 转到 Composition API，最大的感受是逻辑复用变得更加优雅。以前需要 mixin 或者高阶组件才能实现的复用，现在通过 composable 函数就能干净地完成。\n\n特别是 ref 和 reactive 的设计，虽然刚开始需要适应 .value 的写法，但习惯之后会发现代码的可读性和可维护性都提升了很多。\n\n建议新项目直接使用 Composition API + script setup 的方式，开发体验真的很棒。', tags: ['Vue', '前端', '架构'], date: '2024/03/15' },
  { id: 2, title: '代码整洁之道 - 实践感悟', content: '最近重读了《代码整洁之道》，结合实际项目有了更深的体会：\n\n1. 函数应该只做一件事，并且做好。如果一个函数超过20行，大概率可以拆分。\n2. 好的命名胜过注释。变量名要能表达意图，而不只是描述数据类型。\n3. 不要过度设计。YAGNI 原则很重要。\n4. 单元测试不是负担，而是信心的来源。写测试让你敢于重构。', tags: ['编程思想', '代码质量'], date: '2024/02/28' },
  { id: 3, title: '第一次部署线上项目的踩坑记录', content: '部署看起来简单，实际上有很多细节要注意：\n\n- 环境变量一定要分离，不要把密钥写在代码里\n- CORS 问题在本地不会出现，上线后才暴露\n- Nginx 配置 SPA 的 try_files 很关键\n- HTTPS 证书可以用 Let\'s Encrypt 免费申请\n- 日志收集和错误监控从第一天就要做', tags: ['DevOps', '部署', '踩坑'], date: '2024/01/10' },
]

function load() {
  try { var d = localStorage.getItem(KEY); if (d) { notes.value = JSON.parse(d) } else { notes.value = defaults.slice(); save() } }
  catch(e) { notes.value = defaults.slice() }
}
function save() { localStorage.setItem(KEY, JSON.stringify(notes.value)) }
function openNew() { editingNote.value = null; showEditor.value = true }
function openEdit(n) { editingNote.value = Object.assign({}, n); showEditor.value = true }
function saveNote(d) {
  var i = notes.value.findIndex(function(n) { return n.id === d.id })
  if (i >= 0) notes.value[i] = d; else notes.value.unshift(d)
  save(); showEditor.value = false
}
function deleteNote(id) { notes.value = notes.value.filter(function(n) { return n.id !== id }); save() }

onMounted(load)
watch(notes, save, { deep: true })
</script>

<style scoped>
.notes-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
.notes-count { font-size: 0.9rem; color: var(--text-muted); }
.notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; margin-bottom: 40px; }
.notes-empty { padding: 60px 24px; text-align: center; font-size: 1.1rem; color: var(--text-secondary); }
.empty-icon { font-size: 3rem; margin-bottom: 16px; opacity: 0.6; }
@media (max-width: 480px) { .notes-grid { grid-template-columns: 1fr; } .notes-toolbar { flex-direction: column; gap: 12px; align-items: flex-start; } }
</style>
