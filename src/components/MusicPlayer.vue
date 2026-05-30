<template>
  <div class="player-wrapper glass-card" :class="{ playing: isPlaying }">
    <div class="player-ambient" :class="{ active: isPlaying }"></div>

    <div class="player-info">
      <div class="player-disc" :class="{ spinning: isPlaying }">
        <div class="disc-inner">🎵</div>
        <div class="disc-ring"></div>
      </div>
      <div class="player-meta">
        <h4 class="player-song">{{ currentTrack.name }}</h4>
        <p class="player-artist">{{ currentTrack.category }}</p>
      </div>
      <div class="visualizer" :class="{ active: isPlaying }">
        <div class="viz-bar" v-for="i in 12" :key="i" :style="{ animationDelay: (i * 0.08) + 's', height: vizH[i-1] + 'px' }"></div>
      </div>
    </div>

    <div class="player-progress" @click="seek($event)">
      <div class="progress-track">
        <div class="progress-played" :style="{ width: pct + '%' }"></div>
        <div class="progress-thumb" :style="{ left: pct + '%' }"></div>
      </div>
      <div class="progress-time">
        <span>{{ fmt(cur) }}</span>
        <span>{{ fmt(dur) }}</span>
      </div>
    </div>

    <div class="player-controls">
      <button class="ctrl-btn" @click="prev" aria-label="上一首">⏮</button>
      <button class="ctrl-btn play-btn" @click="toggle" :aria-label="playing ? '暂停' : '播放'">{{ playing ? '⏸' : '▶' }}</button>
      <button class="ctrl-btn" @click="next" aria-label="下一首">⏭</button>
      <div class="volume-wrap">
        <button class="ctrl-btn" @click="mute" :aria-label="muted ? '取消静音' : '静音'">{{ muted ? '🔇' : '🔊' }}</button>
        <input type="range" class="volume-slider" min="0" max="1" step="0.05" :value="vol" @input="setVol($event)" aria-label="音量" />
      </div>
    </div>

    <audio ref="audio" :src="currentTrack.url" preload="metadata" @timeupdate="onTime" @ended="next" @loadedmeta="onMeta"></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({ tracks: { type: Array, required: true }, trackIndex: { type: Number, default: 0 } })
const emit = defineEmits(['update:trackIndex'])

const audio = ref(null)
const playing = ref(false)
const cur = ref(0)
const dur = ref(0)
const vol = ref(0.7)
const muted = ref(false)
const vizH = ref([4,4,4,4,4,4,4,4,4,4,4,4])
let vizTmr = null

const currentTrack = computed(() => props.tracks[props.trackIndex] || { name: '暂无音乐', category: '', url: '' })
const pct = computed(() => dur.value > 0 ? (cur.value / dur.value) * 100 : 0)

const startViz = () => { vizTmr = setInterval(() => { vizH.value = Array.from({length:12}, () => 4 + Math.random() * 20) }, 150) }
const stopViz = () => { if (vizTmr) clearInterval(vizTmr); vizH.value = [4,4,4,4,4,4,4,4,4,4,4,4] }

const toggle = () => {
  if (!audio.value) return
  if (playing.value) { audio.value.pause(); playing.value = false; stopViz() }
  else { audio.value.play().catch((e) => { console.warn('播放失败:', e) }); playing.value = true; startViz() }
}
const prev = () => { const idx = props.trackIndex <= 0 ? props.tracks.length - 1 : props.trackIndex - 1; emit('update:trackIndex', idx); afterSwitch() }
const next = () => { const idx = props.trackIndex >= props.tracks.length - 1 ? 0 : props.trackIndex + 1; emit('update:trackIndex', idx); afterSwitch() }
const afterSwitch = () => { setTimeout(() => { if (audio.value) { audio.value.play().catch((e) => { console.warn('播放失败:', e) }); playing.value = true; startViz() } }, 100) }
const onTime = () => { if (audio.value) cur.value = audio.value.currentTime }
const onMeta = () => { if (audio.value) dur.value = audio.value.duration }
const seek = (e) => { if (!audio.value || !dur.value) return; const r = e.currentTarget.getBoundingClientRect(); audio.value.currentTime = ((e.clientX - r.left) / r.width) * dur.value }
const setVol = (e) => { vol.value = parseFloat(e.target.value); if (audio.value) audio.value.volume = vol.value; muted.value = vol.value === 0 }
const mute = () => { muted.value = !muted.value; if (audio.value) audio.value.muted = muted.value }
const fmt = (s) => { if (!s || isNaN(s)) return '0:00'; const m = Math.floor(s / 60), sc = Math.floor(s % 60); return m + ':' + (sc < 10 ? '0' : '') + sc }

watch(() => props.trackIndex, () => { cur.value = 0; dur.value = 0 })
</script>

<style scoped>
.player-wrapper { padding: 28px; margin-bottom: 32px; position: relative; overflow: hidden; }
.player-ambient { position: absolute; inset: 0; background: radial-gradient(circle at 15% 50%, rgba(102,126,234,0.08), transparent 50%); opacity: 0; transition: opacity 0.6s ease; pointer-events: none; }
.player-ambient.active { opacity: 1; }
.player-info { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; position: relative; z-index: 1; }
.player-disc { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-1), var(--accent-2)); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; position: relative; }
.player-disc.spinning { animation: spin 3s linear infinite; }
.disc-ring { position: absolute; inset: 3px; border-radius: 50%; border: 1px dashed rgba(255,255,255,0.2); }
@keyframes spin { to { transform: rotate(360deg); } }
.player-meta { flex: 1; min-width: 0; }
.player-song { font-size: 1.1rem; font-weight: 600; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.player-artist { font-size: 0.85rem; color: var(--text-muted); }

.visualizer { display: flex; align-items: flex-end; gap: 3px; height: 28px; margin-left: auto; flex-shrink: 0; }
.viz-bar { width: 3px; background: linear-gradient(to top, var(--accent-1), var(--accent-3)); border-radius: 2px; transition: height 0.15s ease; min-height: 4px; }
.visualizer:not(.active) .viz-bar { height: 4px !important; opacity: 0.3; }

.player-progress { cursor: pointer; margin-bottom: 16px; position: relative; z-index: 1; }
.progress-track { width: 100%; height: 5px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: visible; position: relative; }
.progress-played { height: 100%; background: linear-gradient(90deg, var(--accent-1), var(--accent-3)); border-radius: 3px; transition: width 0.2s linear; }
.progress-thumb { position: absolute; top: 50%; width: 12px; height: 12px; background: #fff; border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 8px rgba(102,126,234,0.5); opacity: 0; transition: opacity 0.2s ease; }
.player-progress:hover .progress-thumb { opacity: 1; }
.progress-time { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 6px; }

.player-controls { display: flex; align-items: center; justify-content: center; gap: 12px; position: relative; z-index: 1; }
.ctrl-btn { background: none; border: none; color: var(--text-primary); font-size: 1.3rem; cursor: pointer; padding: 8px; border-radius: 50%; transition: all 0.2s ease; }
.ctrl-btn:hover { background: rgba(255,255,255,0.08); }
.play-btn { width: 56px; height: 56px; background: linear-gradient(135deg, var(--accent-1), var(--accent-2)); font-size: 1.4rem; position: relative; overflow: hidden; }
.play-btn:hover { transform: scale(1.08); box-shadow: 0 4px 25px rgba(102,126,234,0.5); }
.volume-wrap { display: flex; align-items: center; gap: 4px; margin-left: auto; }
.volume-slider { width: 80px; height: 4px; accent-color: var(--accent-1); cursor: pointer; }
@media (max-width: 480px) { .volume-wrap { display: none; } .visualizer { display: none; } }
</style>
