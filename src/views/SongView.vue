<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        type="button"
        @click.prevent="newSong(song)"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none"
      >
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold" v-text="song.modified_name" />
        <div v-text="song.genre" />
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{ song.comment_count }})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6" v-if="userLoggedIn">
        <VeeForm :validation-schema="schema" @submit="submit">
          <VeeField
            as="textarea"
            name="comment"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
          ></VeeField>
          <ErrorMessage name="comment" class="text-red-500" />
          <button
            :disabled="commentInSubmission"
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600 block"
          >
            Submit
          </button>
        </VeeForm>
        <!-- Sort Comments -->
        <select
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
          v-model="sort"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto">
    <li
      class="p-6 bg-gray-50 border border-gray-200"
      v-for="comment in getComments"
      :key="comment.docID"
    >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold" v-text="comment.author" />
        <time v-text="comment.created_at" />
      </div>

      <p v-text="comment.comment" />
    </li>
  </ul>
</template>

<script>
import {
  songsCollection,
  commentsCollection,
  usersCollection,
  auth
} from '@/includes/firebase'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SongView',
  data () {
    return {
      song: {},
      schema: {
        comment: 'required|min:3'
      },
      commentInSubmission: false,
      pendingRequest: false,
      comments: [],
      cAuthors: [],
      sort: 'latest'
    }
  },
  async created () {
    const docSnapshot = await songsCollection.doc(this.$route.params.id).get()

    if (!docSnapshot.exists) {
      this.$router.push({ name: 'home' })
    }

    const { sort } = this.$route.query

    this.sort = (sort + '').match('latest|oldest') ? sort : 'latest'

    this.song = docSnapshot.data()
    this.loadComments()
  },
  computed: {
    getComments () {
      return this.sort === 'latest'
        ? [...this.comments].reverse()
        : this.comments
    },
    ...mapState(['userLoggedIn'])
  },
  methods: {
    async submit (values, { resetForm }) {
      if (this.commentInSubmission) {
        return
      }

      this.commentInSubmission = true

      const userComment = {
        uid: auth.currentUser.uid,
        songId: this.$route.params.id,
        created_at: Date.now(),
        ...values
      }

      try {
        await commentsCollection.add(userComment)
        this.song.comment_count += 1
        await songsCollection
          .doc(this.$route.params.id)
          .update({ comment_count: this.song.comment_count })
      } catch (error) {
        this.commentInSubmission = false
        return
      }

      resetForm()

      this.loadComments()

      this.commentInSubmission = false
    },
    async loadComments () {
      if (this.pendingRequest) {
        return
      }

      this.pendingRequest = true

      let snapshots
      if (this.comments.length) {
        const lastDoc = await commentsCollection
          .doc(this.comments[this.comments.length - 1].docID)
          .get()
        snapshots = await commentsCollection
          .orderBy('created_at')
          .startAfter(lastDoc)
          .get()
      } else {
        snapshots = await commentsCollection.orderBy('created_at').get()
      }

      snapshots.forEach(async document => {
        const author =
          this.cAuthors[document.data().uid] ||
          await this.getAuthor(document.data().uid)
        this.comments.push({
          docID: document.id,
          author,
          ...document.data()
        })
      })

      this.pendingRequest = false
    },
    async getAuthor (uid) {
      const author = (await usersCollection.doc(uid).get()).data().name

      this.cAuthors[uid] = author
      return author
    },
    ...mapActions('player', ['newSong'])
  },
  watch: {
    sort (newVal) {
      this.$router.push({
        query: {
          sort: newVal
        }
      })
    }
  }
}
</script>
