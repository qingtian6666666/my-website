<template>
  <div class="page-container">
    <div class="section-header scroll-reveal">
      <h1 class="page-title">联系我</h1>
      <p class="page-subtitle">期待与你的交流与合作</p>
    </div>

    <div class="contact-layout">
      <div class="contact-form-wrap glass-card scroll-reveal-scale">
        <h3 class="form-title">发送消息</h3>
        <form class="contact-form" @submit.prevent="handleSubmit">
          <div class="form-row">
            <div class="form-group">
              <label>姓名</label>
              <input v-model="form.name" type="text" placeholder="你的姓名" required />
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input v-model="form.email" type="email" placeholder="你的邮箱" required />
            </div>
          </div>
          <div class="form-group">
            <label>主题</label>
            <input v-model="form.subject" type="text" placeholder="消息主题" required />
          </div>
          <div class="form-group">
            <label>消息</label>
            <textarea v-model="form.message" placeholder="写下你想说的..." rows="5" required></textarea>
          </div>
          <button type="submit" class="btn-gradient" :class="{ sent: submitted }">
            <span>{{ submitted ? '✓ 已发送' : '✦ 发送消息' }}</span>
          </button>
        </form>
      </div>

      <div class="contact-info scroll-reveal-scale" style="transition-delay:0.15s">
        <div class="info-card glass-card">
          <div class="info-icon">📧</div>
          <h4>电子邮箱</h4>
          <p class="info-value">2434005232@qq.com</p>
          <button class="copy-btn" @click="copyEmail">{{ copied ? '已复制 ✓' : '复制邮箱' }}</button>
        </div>

        <div class="info-card glass-card">
          <div class="info-icon">🐙</div>
          <h4>GitHub</h4>
          <p class="info-value">qingtian6666666</p>
          <a href="https://github.com/qingtian6666666" target="_blank" rel="noopener" class="info-link">访问主页 →</a>
        </div>

        <div class="info-card glass-card">
          <div class="info-icon">💬</div>
          <h4>微信</h4>
          <p class="info-value">扫码添加</p>
          <p class="info-note">请备注来意</p>
        </div>

        <div class="info-card glass-card">
          <div class="info-icon">📍</div>
          <h4>位置</h4>
          <p class="info-value">中国</p>
          <p class="info-note">远程协作没问题</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { usePageMeta } from '../composables/usePageMeta.js'

usePageMeta({
  title: '联系我',
  description: '期待与你的交流与合作 - Bob Song 的联系方式。',
})

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const submitted = ref(false)
const copied = ref(false)

const handleSubmit = () => {
  // 模拟提交
  submitted.value = true
  setTimeout(() => {
    submitted.value = false
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  }, 3000)
}

const copyEmail = () => {
  navigator.clipboard.writeText('2434005232@qq.com').then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }).catch(() => {
    // 降级方案
    const ta = document.createElement('textarea')
    ta.value = '2434005232@qq.com'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}
</script>

<style scoped>
.contact-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 32px;
  align-items: start;
}
.contact-form-wrap {
  padding: 36px;
}
.form-title {
  font-size: 1.3rem;
  margin-bottom: 24px;
  font-weight: 600;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.form-group {
  margin-bottom: 18px;
}
.form-group label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 0.95rem;
  font-family: inherit;
  transition: var(--transition);
  outline: none;
}
.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--accent-1);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}
.form-group textarea {
  resize: vertical;
  min-height: 100px;
}
.btn-gradient.sent {
  background: linear-gradient(135deg, #5ee7df, #42b883);
}

.contact-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.info-card {
  padding: 24px;
  text-align: center;
}
.info-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}
.info-card h4 {
  font-size: 0.95rem;
  margin-bottom: 6px;
  color: var(--text-primary);
}
.info-value {
  color: var(--accent-1);
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 10px;
}
.info-link {
  font-size: 0.85rem;
  color: var(--accent-1);
  text-decoration: none;
  transition: var(--transition);
}
.info-link:hover {
  color: var(--accent-3);
}
.info-note {
  font-size: 0.8rem;
  color: var(--text-muted);
}
.copy-btn {
  padding: 6px 16px;
  border-radius: 50px;
  border: 1px solid var(--glass-border);
  background: rgba(102, 126, 234, 0.1);
  color: var(--accent-1);
  font-size: 0.8rem;
  cursor: pointer;
  transition: var(--transition);
}
.copy-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: var(--accent-1);
}

@media (max-width: 768px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .contact-info {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 480px) {
  .contact-info {
    grid-template-columns: 1fr;
  }
}
</style>
