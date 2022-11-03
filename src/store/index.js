import { createStore } from 'vuex'
import { auth, usersCollection } from '@/includes/firebase'
import player from './player'

export default createStore({
  modules: {
    player
  },
  state: {
    authModalShow: false,
    userLoggedIn: false
  },
  getters: {
    // authModalShow: state => state.authModalShow
  },
  mutations: {
    toggleAuthModal (state) {
      state.authModalShow = !state.authModalShow
    },
    toggleAuth (state) {
      state.userLoggedIn = !state.userLoggedIn
    }
  },
  actions: {
    async register ({ commit }, payload) {
      const userCred = await auth.createUserWithEmailAndPassword(
        payload.email,
        payload.password
      )

      await usersCollection.doc(userCred.user.uid).set({
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country
      })

      userCred.user.updateProfile({
        displayName: payload.name
      })

      commit('toggleAuth')
    },
    async login ({ commit }, payload) {
      await auth.signInWithEmailAndPassword(payload.email, payload.password)

      commit('toggleAuth')
    },
    async signout ({ commit } /*, { router, route } */) {
      await auth.signOut()

      commit('toggleAuth')

      // if (route.meta.requiresAuth) {
      //   router.push({ name: 'home' })
      // }
    },
    init_login ({ commit }) {
      const user = auth.currentUser

      if (user) {
        commit('toggleAuth')
      }
    }
  }
})
