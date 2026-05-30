<template>
  <div class="audio-player" :class="{ expanded: isExpanded }">
    <!-- 可视化条 -->
    <div class="visualizer" aria-hidden="true">
      <div
        v-for="(h, i) in bars"
        :key="i"
        class="viz-bar"
        :style="{ height: h + 'px', animationDelay: (i * 0.05) + 's' }"
        :class="{ playing: isPlaying }"
      ></div>
    </div>

    <!-- 控制面板 -->
    <div class="ap-panel glass-card" @click="isExpanded = !isExpanded" tabindex="0" role="button" :aria-expanded="isExpanded" aria-label="音乐播放器控制面板">
      <div class="ap-info" v-if="currentTrack">
        <span class="ap-title">{{ currentTrack.title }}</span>
        <span class="ap-artist">{{ currentTrack.artist || '未知艺术家' }}</span>
      </div>
      <div class="ap-info" v-else>
        <span class="ap-title">音乐播放器</span>
        <span class="ap-artist">点击播放</span>
      </div>

      <div class="ap-controls" @click.stop>
        <button class="ap-btn" @click="prev" aria-label="上一首">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
        </button>
        <button class="ap-btn ap-btn-play" @click="togglePlay" :aria-label="isPlaying ? '暂停' : '播放'">
          <svg v-if="!isPlaying" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </button>
        <button class="ap-btn" @click="next" aria-label="下一首">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
        </button>
      </div>
    </div>

    <audio ref="audioEl" @ended="next" @timeupdate="onTimeUpdate"></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const tracks = [
  { title: 'Ambient Space', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Electronic Dreams', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { title: 'Deep Focus', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
]

const audioEl = ref(null)
const currentIndex = ref(0)
const isPlaying = ref(false)
const isExpanded = ref(false)
const bars = ref(Array(12).fill(3))

const currentTrack = computed(() => tracks[currentIndex.value])

let vizInterval = null

const togglePlay = () => {
  if (!audioEl.value) return
  if (isPlaying.value) {
    audioEl.value.pause()
    isPlaying.value = false
    stopViz()
  } else {
    audioEl.value.play().catch((e) => { console.warn('播放失败:', e) })
    isPlaying.value = true
    startViz()
  }
}

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + tracks.length) % tracks.length
  playCurrent()
}

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % tracks.length
  playCurrent()
}

const playCurrent = () => {
  if (!audioEl.value) return
  audioEl.value.src = tracks[currentIndex.value].src
  audioEl.value.play().catch((e) => { console.warn('播放失败:', e) })
  isPlaying.value = true
  startViz()
}

const startViz = () => {
  stopViz()
  vizInterval = setInterval(() => {
    bars.value = bars.value.map(() => Math.floor(Math.random() * 20) + 3)
  }, 150)
}

const stopViz = () => {
  if (vizInterval) { clearInterval(vizInterval); vizInterval = null }
  bars.value = Array(12).fill(3)
}

const onTimeUpdate = () => { /* 可扩展进度条 */ }

watch(currentIndex, () => {
  // SPA 切换不断流
})

onMounted(() => {
  if (audioEl.value) {
    audioEl.value.volume = 0.5
    audioEl.value.preload = 'none'
  }
})

onUnmounted(() => {
  if (vizInterval) { clearInterval(vizInterval); vizInterval = null }
})
</script>

<style scoped>
.audio-player {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 998;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

/* 可视化条 */
.visualizer {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 28px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.audio-player.expanded .visualizer,
.audio-player:hover .visualizer {
  opacity: 1;
  transform: translateY(0);
}

.viz-bar {
  width: 3px;
  min-height: 3px;
  background: linear-gradient(180deg, var(--neon-purple), var(--neon-cyan));
  border-radius: 2px;
  transition: height 0.12s ease;
  box-shadow: 0 0 4px rgba(168, 85, 247, 0.3);
}

.viz-bar.playing {
  animation: vizPulse 0.8s ease-in-out infinite alternate;
}

@keyframes vizPulse {
  0% { opacity: 0.6; }
  100% { opacity: 1; }
}

/* 控制面板 */
.ap-panel {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  cursor: pointer;
  min-width: 280px;
  border-radius: var(--radius-lg);
}

.ap-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.ap-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.5px;
}

.ap-artist {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 300;
}

.ap-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ap-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  background: rgba(168, 85, 247, 0.08);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.ap-btn:hover {
  border-color: var(--neon-purple);
  color: var(--neon-purple);
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.2);
}

.ap-btn-play {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(6, 182, 212, 0.2));
  border-color: rgba(168, 85, 247, 0.3);
}

.ap-btn-play:hover {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.35), rgba(6, 182, 212, 0.35));
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.3), 0 0 30px rgba(6, 182, 212, 0.15);
}

@media (max-width: 768px) {
  .audio-player {
    bottom: 16px;
    right: 16px;
  }
  .ap-panel {
    min-width: 240px;
    padding: 10px 16px;
  }
}
</style>
