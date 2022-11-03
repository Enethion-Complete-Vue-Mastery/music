<template>
  <AppHeader />

  <RouterView />

  <!-- Player -->
  <PlayerComponent />

  <AppAuth />
</template>

<script>
import AppHeader from './components/Header.vue'
import AppAuth from './components/Auth.vue'
import PlayerComponent from './components/PlayerComponent'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
    PlayerComponent
  },
  created () {
    this.$store.dispatch('init_login')
  }
}
</script>
