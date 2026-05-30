<template>
  <div class="editor-overlay" @click.self="$emit('close')">
    <div class="editor-modal glass-card" ref="modalRef" role="dialog" aria-modal="true" :aria-label="isEdit ? '编辑心得' : '新增心得'">
      <div class="editor-header">
        <h3>{{ isEdit ? '编辑心得' : '新增心得' }}</h3>
        <button class="editor-close" @click="$emit('close')">✕</button>
      </div>
      <div class="editor-body">
        <div class="form-group">
          <label for="note-title">标题</label>
          <input id="note-title" v-model="form.title" type="text" placeholder="心得标题..." class="form-input" />
        </div>
        <div class="form-group">
          <label for="note-tags">标签（用逗号分隔）</label>
          <input id="note-tags" v-model="tagsInput" type="text" placeholder="例如：Vue, 心得, 架构" class="form-input" />
        </div>
        <div class="form-group">
          <label for="note-content">内容</label>
          <textarea id="note-content" v-model="form.content" placeholder="写下你的开发心得..." class="form-textarea" rows="10"></textarea>
        </div>
      </div>
      <div class="editor-footer">
        <button class="btn-cancel" @click="$emit('close')">取消</button>
        <button class="btn-gradient" @click="save" :disabled="!form.title.trim() || !form.content.trim()">
          {{ isEdit ? '保存修改' : '发布心得' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFocusTrap } from '../composables/useFocusTrap.js'
import { generateId } from '../utils/id.js'

const props = defineProps({
  note: { type: Object, default: null },
})

const emit = defineEmits(['save', 'close'])
const modalRef = ref(null)

const isEdit = computed(() => !!props.note)

useFocusTrap(modalRef, { onEscape: () => emit('close') })

const form = ref({
  title: props.note?.title || '',
  content: props.note?.content || '',
})

const tagsInput = ref(props.note?.tags?.join(', ') || '')

function save() {
  const tags = tagsInput.value
    .split(/[,，]/)
    .map(t => t.trim())
    .filter(Boolean)
  emit('save', {
    id: props.note?.id || generateId(),
    title: form.value.title.trim(),
    content: form.value.content.trim(),
    tags,
    date: props.note?.date || new Date().toLocaleDateString('zh-CN'),
  })
}
</script>

<style scoped>
.editor-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
  animation: fadeIn 0.2s ease;
}

.editor-modal {
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--glass-border);
}

.editor-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.editor-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.editor-close:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.08);
}

.editor-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--accent-1);
}

.form-textarea {
  resize: vertical;
  min-height: 150px;
  line-height: 1.7;
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--glass-border);
}

.btn-cancel {
  padding: 10px 24px;
  background: none;
  border: 1px solid var(--glass-border);
  border-radius: 50px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  border-color: var(--text-muted);
  color: var(--text-primary);
}

.btn-gradient:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}
</style>
