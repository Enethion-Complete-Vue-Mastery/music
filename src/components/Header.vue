<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <RouterLink
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
        >Music</RouterLink
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <RouterLink class="px-2 text-white" :to="{ name: 'about' }"
              >About</RouterLink
            >
          </li>
          <li v-if="!userLoggedIn">
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="toggleAuthModal"
            >
              Login / Register
            </a>
          </li>
          <template v-else>
            <li>
              <RouterLink class="px-2 text-white" :to="{ name: 'manage' }"
                >Manage</RouterLink
              >
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="signout"
                >Logout</a
              >
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'AppHeader',
  computed: {
    ...mapState(['userLoggedIn'])
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),
    signout () {
      this.$store.dispatch('signout', {
        router: this.$router,
        route: this.$route
      })
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: 'home' })
      }
    }
    // toggleAuthModal () {
    //   this.$store.commit('toggleAuthModal')
    // }
  }
}
</script>
