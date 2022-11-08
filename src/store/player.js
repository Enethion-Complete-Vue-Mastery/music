import { Howl } from 'howler'
import helper from '@/includes/helper'

export default {
  namespaced: true,
  state: {
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%'
  },
  getters: {
    playing (state) {
      if (state.sound.playing) {
        return state.sound.playing()
      }

      return false
    }
  },
  mutations: {
    setCurrentSong (state, song) {
      state.currentSong = song

      state.sound = new Howl({
        src: [song.url],
        html5: true
      })

      state.sound.play()
    },
    progressMutation (state) {
      state.seek = helper.formatTime(state.sound.seek())
      state.duration = helper.formatTime(state.sound.duration())
      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) *
        100 || 0}%`
    }
  },
  actions: {
    async newSong ({ commit, state, dispatch }, song) {
      if (state.sound instanceof Howl) {
        state.sound.unload()
      }

      await commit('setCurrentSong', song)

      state.sound.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('progress')
        })
      })
    },
    async toggleAudio ({ state }) {
      if (!state.sound.playing) {
        return
      }

      if (state.sound.playing()) {
        state.sound.pause()
      } else {
        state.sound.play()
      }
    },
    async progress ({ commit, dispatch, state }) {
      await commit('progressMutation')
      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress')
        })
      }
    },
    updateSeek ({ dispatch, state }, event) {
      if (!state.sound.playing) {
        return
      }

      const { x, width } = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - x
      const percentage = clickX / width
      const seconds = state.sound.duration() * percentage

      state.sound.seek(seconds)
      state.sound.once('seek', () => { dispatch('progress') })
    }
  }
}
