<template>
  <div class="page-container">
    <div class="section-header scroll-reveal">
      <h1 class="page-title">音乐空间</h1>
      <p class="page-subtitle">放松心灵，沉浸在轻音乐与自然之声中</p>
    </div>

    <div class="scroll-reveal">
      <MusicPlayer :tracks="filtered" :trackIndex="idx" @update:trackIndex="idx = $event" />
    </div>

    <div class="music-cats scroll-reveal" style="transition-delay:0.1s">
      <button class="cat-btn" :class="{ active: cat === c }" v-for="c in cats" :key="c" @click="switchCat(c)">
        {{ icons[c] }} {{ c }}
      </button>
    </div>

    <div class="track-list">
      <div class="track-item glass-card scroll-reveal" v-for="(t, i) in filtered" :key="t.name" :class="{ active: i === idx }" :style="{ transitionDelay: (i * 0.06) + 's' }" @click="idx = i">
        <div class="track-idx">
          <span v-if="i !== idx">{{ pad(i + 1) }}</span>
          <span v-else class="eq-wrap"><span class="eq"></span><span class="eq"></span><span class="eq"></span></span>
        </div>
        <div class="track-info">
          <h4>{{ t.name }}</h4>
          <p>{{ t.category }}</p>
        </div>
        <span class="track-dur">{{ t.duration }}</span>
      </div>
    </div>

    <div class="music-tip glass-card scroll-reveal" style="transition-delay:0.2s">
      <span>💡</span>
      <p>音乐资源来自免费在线音频。戴上耳机效果更佳，适合编程、学习、冥想或睡前聆听。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MusicPlayer from '../components/MusicPlayer.vue'

var cat = ref('全部')
var idx = ref(0)
var cats = ['全部', '轻音乐', '自然白噪音', '助眠音乐']
var icons = { '全部': '🎶', '轻音乐': '🎹', '自然白噪音': '🌊', '助眠音乐': '🌙' }
var all = [
  { name: '宁静钢琴曲', category: '轻音乐', duration: '3:20', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { name: '林间漫步', category: '轻音乐', duration: '4:15', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { name: '晨光序曲', category: '轻音乐', duration: '3:45', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { name: '雨滴敲窗', category: '自然白噪音', duration: '5:00', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { name: '海浪拍岸', category: '自然白噪音', duration: '4:30', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { name: '山间溪流', category: '自然白噪音', duration: '5:20', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { name: '星空冥想', category: '助眠音乐', duration: '6:00', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { name: '月光摇篮曲', category: '助眠音乐', duration: '4:50', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { name: '深海安眠', category: '助眠音乐', duration: '5:30', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
]
var filtered = computed(function() { return cat.value === '全部' ? all : all.filter(function(t) { return t.category === cat.value }) })
function switchCat(c) { cat.value = c; idx.value = 0 }
function pad(n) { return n < 10 ? '0' + n : '' + n }
</script>

<style scoped>
.music-cats { display: flex; gap: 12px; margin-bottom: 28px; flex-wrap: wrap; }
.cat-btn { padding: 10px 22px; background: var(--bg-card); border: 1px solid var(--glass-border); border-radius: 50px; color: var(--text-secondary); font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; }
.cat-btn:hover { border-color: var(--accent-1); color: var(--text-primary); background: rgba(102,126,234,0.08); }
.cat-btn.active { background: linear-gradient(135deg, var(--accent-1), var(--accent-2)); color: #fff; border-color: transparent; box-shadow: 0 4px 15px rgba(102,126,234,0.3); }

.track-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 32px; }
.track-item { display: flex; align-items: center; gap: 16px; padding: 16px 20px; cursor: pointer; border-radius: var(--radius-sm); position: relative; overflow: hidden; }
.track-item::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at left center, rgba(102,126,234,0.08), transparent 50%); opacity: 0; transition: opacity 0.3s ease; pointer-events: none; }
.track-item.active::before { opacity: 1; }
.track-item:hover { transform: none; background: var(--bg-card-hover); }
.track-item.active { border-color: rgba(102,126,234,0.4); background: rgba(102,126,234,0.1); }
.track-idx { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; min-width: 28px; display: flex; align-items: center; justify-content: center; }
.track-item.active .track-idx { color: var(--accent-1); }
.eq-wrap { display: flex; align-items: flex-end; gap: 2px; height: 14px; }
.eq { width: 3px; background: var(--accent-1); border-radius: 1px; animation: eqB 0.6s ease-in-out infinite alternate; }
.eq:nth-child(1) { height: 6px; animation-delay: 0s; }
.eq:nth-child(2) { height: 10px; animation-delay: 0.15s; }
.eq:nth-child(3) { height: 4px; animation-delay: 0.3s; }
@keyframes eqB { 0% { height: 4px; } 100% { height: 14px; } }
.track-info { flex: 1; }
.track-info h4 { font-size: 0.95rem; font-weight: 600; margin-bottom: 2px; }
.track-info p { font-size: 0.8rem; color: var(--text-muted); }
.track-dur { font-size: 0.85rem; color: var(--text-muted); }

.music-tip { padding: 20px 24px; font-size: 0.9rem; color: var(--text-secondary); display: flex; align-items: center; gap: 12px; }
@media (max-width: 480px) { .music-cats { gap: 8px; } .cat-btn { padding: 8px 16px; font-size: 0.82rem; } }
</style>
