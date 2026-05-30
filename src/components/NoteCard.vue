<template>
  <div class="note-card glass-card" @click="$emit('edit')" @keydown.enter="$emit('edit')" tabindex="0" role="article" :aria-label="'心得: ' + note.title">
    <div class="nc-shine"></div>
    <div class="nc-header">
      <div class="nc-tags"><span class="tag" v-for="t in note.tags" :key="t">{{ t }}</span></div>
      <button class="nc-del" @click.stop="confirmDel">{{ confirming ? '确认?' : '✕' }}</button>
    </div>
    <h3 class="nc-title">{{ note.title }}</h3>
    <div class="nc-content" v-html="renderedContent"></div>
    <div class="nc-footer">
      <span class="nc-date">{{ note.date }}</span>
      <span class="nc-hint">点击编辑 &rarr;</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { renderMarkdown } from '../utils/markdown.js'
import { sanitizeHTML } from '../utils/sanitize.js'

const props = defineProps({ note: { type: Object, required: true } })
const emit = defineEmits(['edit', 'delete'])
const confirming = ref(false)
let tmr = null

const confirmDel = () => {
  if (confirming.value) { emit('delete'); confirming.value = false; clearTimeout(tmr) }
  else { confirming.value = true; tmr = setTimeout(() => { confirming.value = false }, 3000) }
}

// 渲染内容：markdown + 消毒
const renderedContent = computed(() => sanitizeHTML(renderMarkdown(props.note.content)))
</script>

<style scoped>
.note-card { padding: 24px; cursor: pointer; position: relative; overflow: hidden; }
.nc-shine { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(168,85,247,0.03), transparent); transition: left 0.5s ease; pointer-events: none; }
.note-card:hover .nc-shine { left: 100%; }
.nc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.nc-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.nc-del { background: none; border: none; color: var(--text-muted); font-size: 0.85rem; cursor: pointer; padding: 4px 8px; border-radius: var(--radius-sm); transition: all 0.2s ease; flex-shrink: 0; }
.nc-del:hover { color: var(--danger); background: rgba(255,107,107,0.1); }
.nc-title { font-size: 1.15rem; font-weight: 700; margin-bottom: 10px; transition: color 0.2s ease; letter-spacing: 0.5px; }
.note-card:hover .nc-title { background: linear-gradient(135deg, var(--neon-purple), var(--neon-cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.nc-content {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 300;
}

/* 代码块样式 */
.nc-content :deep(.code-block) {
  background: #0d1117;
  border: 1px solid rgba(168, 85, 247, 0.15);
  border-radius: var(--radius);
  padding: 16px 20px;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.8;
  color: #c9d1d9;
  margin: 12px 0;
  overflow: hidden;
  animation: codeGlow 4s ease-in-out infinite;
}

.nc-content :deep(.inline-code) {
  background: rgba(168, 85, 247, 0.1);
  color: var(--neon-purple);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.85em;
  border: 1px solid rgba(168, 85, 247, 0.15);
}

@keyframes codeGlow {
  0%, 100% { box-shadow: 0 0 12px rgba(168, 85, 247, 0.06), inset 0 0 12px rgba(168, 85, 247, 0.02); }
  50% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.12), inset 0 0 20px rgba(168, 85, 247, 0.04); }
}

.nc-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--glass-border); }
.nc-date { font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono); }
.nc-hint { font-size: 0.75rem; color: var(--neon-purple); opacity: 0; transform: translateX(-8px); transition: all 0.2s ease; }
.note-card:hover .nc-hint { opacity: 0.8; transform: translateX(0); }
</style>
