<template>
  <div class="note-card glass-card" @click="$emit('edit')">
    <div class="nc-shine"></div>
    <div class="nc-header">
      <div class="nc-tags"><span class="tag" v-for="t in note.tags" :key="t">{{ t }}</span></div>
      <button class="nc-del" @click.stop="confirmDel">{{ confirming ? '确认?' : '✕' }}</button>
    </div>
    <h3 class="nc-title">{{ note.title }}</h3>
    <p class="nc-content">{{ note.content }}</p>
    <div class="nc-footer">
      <span class="nc-date">{{ note.date }}</span>
      <span class="nc-hint">点击编辑 &rarr;</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ note: { type: Object, required: true } })
var emit = defineEmits(['edit', 'delete'])
var confirming = ref(false)
var tmr = null
function confirmDel() {
  if (confirming.value) { emit('delete'); confirming.value = false; clearTimeout(tmr) }
  else { confirming.value = true; tmr = setTimeout(function() { confirming.value = false }, 3000) }
}
</script>

<style scoped>
.note-card { padding: 24px; cursor: pointer; position: relative; overflow: hidden; }
.nc-shine { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent); transition: left 0.5s ease; pointer-events: none; }
.note-card:hover .nc-shine { left: 100%; }
.nc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.nc-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.nc-del { background: none; border: none; color: var(--text-muted); font-size: 0.85rem; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: all 0.2s ease; flex-shrink: 0; }
.nc-del:hover { color: var(--danger); background: rgba(255,107,107,0.1); }
.nc-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 10px; transition: color 0.2s ease; }
.note-card:hover .nc-title { background: linear-gradient(135deg, var(--accent-1), var(--accent-3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.nc-content { color: var(--text-secondary); font-size: 0.92rem; line-height: 1.7; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
.nc-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--glass-border); }
.nc-date { font-size: 0.8rem; color: var(--text-muted); }
.nc-hint { font-size: 0.78rem; color: var(--accent-1); opacity: 0; transform: translateX(-8px); transition: all 0.2s ease; }
.note-card:hover .nc-hint { opacity: 0.8; transform: translateX(0); }
</style>
