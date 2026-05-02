<template>
  <div class="page-container">
    <div class="section-header scroll-reveal">
      <h1 class="page-title">未来展望</h1>
      <p class="page-subtitle">对技术、职业与人生的思考与规划</p>
    </div>

    <div class="vision-grid">
      <div class="vision-card glass-card scroll-reveal" v-for="(card, i) in visions" :key="i" :style="{ transitionDelay: (i * 0.12) + 's', '--glow': card.glow }">
        <div class="vc-bg"></div>
        <div class="vc-header">
          <span class="vc-icon">{{ card.icon }}</span>
          <span class="vc-cat">{{ card.category }}</span>
        </div>
        <h3 class="vc-title">{{ card.title }}</h3>
        <p class="vc-desc">{{ card.desc }}</p>
        <ul class="vc-goals">
          <li v-for="(g, j) in card.goals" :key="j">
            <span class="goal-dot">&#10022;</span>
            <span>{{ g }}</span>
          </li>
        </ul>
        <div class="vc-bar" :style="{ background: card.color }">
          <div class="vc-bar-glow" :style="{ background: card.color }"></div>
        </div>
      </div>
    </div>

    <div class="vision-quote glass-card scroll-reveal-scale" style="transition-delay:0.5s">
      <div class="quote-icon">&#10022;</div>
      <p>"未来不是用来等待的，而是用来创造的。技术的每一次突破，都源自不甘平凡的灵魂。"</p>
      <div class="quote-line"></div>
    </div>
  </div>
</template>

<script setup>
var visions = [
  {
    icon: '🤖', category: '技术目标', title: '深耕 AI 与大模型',
    color: 'linear-gradient(135deg, #667eea, #764ba2)', glow: 'rgba(102,126,234,0.3)',
    desc: '深入理解大语言模型原理，探索 AI 在实际业务中的落地应用。',
    goals: ['掌握 Prompt Engineering 与 Agent 架构', '开发个人 AI 应用产品', '参与开源 AI 项目贡献', '关注 AI 安全与伦理问题'],
  },
  {
    icon: '🏗️', category: '技术目标', title: '全栈架构能力提升',
    color: 'linear-gradient(135deg, #5ee7df, #667eea)', glow: 'rgba(94,231,223,0.3)',
    desc: '从写代码到做架构，提升系统设计和工程化思维能力。',
    goals: ['学习分布式系统设计', '掌握云原生与容器化部署', '深入性能优化与监控', '提高代码质量与工程规范'],
  },
  {
    icon: '💼', category: '职业发展', title: '成为技术影响者',
    color: 'linear-gradient(135deg, #f093fb, #f5576c)', glow: 'rgba(240,147,251,0.3)',
    desc: '不仅做好技术，也要输出技术影响力，帮助更多人。',
    goals: ['坚持写技术博客与教程', '参与技术社区分享', '打造个人技术品牌', '探索技术创业可能性'],
  },
  {
    icon: '🌱', category: '个人成长', title: '平衡发展与生活',
    color: 'linear-gradient(135deg, #43e97b, #38f9d7)', glow: 'rgba(67,233,123,0.3)',
    desc: '在技术追求的同时，关注身心健康和个人全方位成长。',
    goals: ['保持运动与健康习惯', '培养编程之外的兴趣爱好', '阅读更多非技术书籍', '学会时间管理与自我调节'],
  },
]
</script>

<style scoped>
.vision-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 48px; }
.vision-card { padding: 32px; position: relative; overflow: hidden; }
.vc-bg { position: absolute; inset: 0; background: radial-gradient(circle at top right, var(--glow), transparent 60%); opacity: 0; transition: opacity 0.4s ease; pointer-events: none; }
.vision-card:hover .vc-bg { opacity: 1; }
.vc-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; position: relative; z-index: 1; }
.vc-icon { font-size: 2rem; transition: transform 0.3s ease; }
.vision-card:hover .vc-icon { transform: scale(1.15) rotate(-5deg); }
.vc-cat { padding: 4px 14px; background: rgba(102,126,234,0.12); color: var(--accent-1); border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1px solid rgba(102,126,234,0.15); }
.vc-title { font-size: 1.4rem; margin-bottom: 12px; font-weight: 700; position: relative; z-index: 1; }
.vc-desc { color: var(--text-secondary); margin-bottom: 20px; line-height: 1.7; position: relative; z-index: 1; }
.vc-goals { list-style: none; display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; }
.vc-goals li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.92rem; color: var(--text-secondary); transition: color 0.2s ease; }
.vision-card:hover .vc-goals li { color: var(--text-primary); }
.goal-dot { color: var(--accent-1); font-size: 0.7rem; margin-top: 5px; flex-shrink: 0; transition: transform 0.2s ease; }
.vision-card:hover .goal-dot { transform: scale(1.3); }
.vc-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; opacity: 0.6; transition: opacity 0.3s ease, height 0.3s ease; }
.vc-bar-glow { position: absolute; inset: 0; filter: blur(8px); opacity: 0; transition: opacity 0.3s ease; }
.vision-card:hover .vc-bar { opacity: 1; height: 4px; }
.vision-card:hover .vc-bar-glow { opacity: 0.8; }

.vision-quote { padding: 48px 40px; text-align: center; font-size: 1.2rem; color: var(--text-secondary); font-style: italic; line-height: 1.8; overflow: hidden; }
.quote-icon { font-size: 2rem; background: linear-gradient(135deg, var(--accent-1), var(--accent-3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 16px; opacity: 0.6; }
.vision-quote p { max-width: 600px; margin: 0 auto; }
.quote-line { width: 60px; height: 2px; background: linear-gradient(90deg, var(--accent-1), var(--accent-3)); margin: 24px auto 0; border-radius: 1px; }

@media (max-width: 768px) {
  .vision-grid { grid-template-columns: 1fr; }
  .vision-quote { font-size: 1rem; padding: 28px; }
}
</style>
