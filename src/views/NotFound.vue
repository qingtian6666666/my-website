<template>
  <div class="page-container not-found">
    <div class="nf-content animate-fadeInUp">
      <div class="nf-code">404</div>
      <div class="nf-orb"></div>
      <h1 class="nf-title">页面走丢了</h1>
      <p class="nf-desc">你访问的页面不存在或已被移除</p>
      <router-link to="/" class="btn-gradient"><span>返回首页</span></router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.nf-content {
  position: relative;
}
.nf-code {
  font-size: 10rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}
.nf-orb {
  position: absolute;
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(102, 126, 234, 0.15), transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
  z-index: 0;
}
.nf-title {
  font-size: 1.8rem;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}
.nf-desc {
  color: var(--text-secondary);
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}
@media (max-width: 480px) {
  .nf-code { font-size: 6rem; }
  .nf-title { font-size: 1.3rem; }
}
</style>
