<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-if="!isEditMode">
      <h4 class="inline-block text-2xl font-bold" v-text="song.modified_name" />
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click="isEditMode = true"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-else>
      <div
        class="text-white text-center font-center font-bold p-4 mb-4"
        v-if="show_alert"
        :class="alert_variant"
      >
        {{ alert_message }}
      </div>
      <VeeForm
        :validation-schema="schema"
        @submit="saveSong"
        :initial-values="song"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <VeeField
            type="text"
            name="modified_name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="setUnsavedFlag(true)"
          />
          <ErrorMessage name="modified_name" class="text-red-600" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <VeeField
            type="text"
            name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="setUnsavedFlag(true)"
          />
          <ErrorMessage name="genre" class="text-red-600" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission"
          @click.prevent="isEditMode = false"
        >
          Go Back
        </button>
      </VeeForm>
    </div>
  </div>
</template>

<script>
import { songsCollection, storage } from '@/includes/firebase'
export default {
  name: 'AppCompositionItem',
  props: {
    song: {
      required: true,
      type: Object
    },
    updateSong: {
      required: true,
      type: Function
    },
    index: {
      required: true,
      type: Number
    },
    removeSong: {
      required: true,
      type: Function
    },
    setUnsavedFlag: {
      type: Function
    }
  },
  data () {
    return {
      isEditMode: false,
      schema: {
        modified_name: 'required|min:2|max:100',
        genre: 'min:2|max:100'
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait. Updating song info.'
    }
  },
  methods: {
    async saveSong (values) {
      this.in_submission = true
      this.show_alert = true
      this.alert_variant = 'bg-blue-500'
      this.alert_message = 'Please wait. Updating song info.'

      try {
        await songsCollection.doc(this.song.docID).update(values)
      } catch (error) {
        this.alert_variant = 'bg-red-500'
        this.alert_message = 'Something went wrong. Try again later'
        this.in_submission = false
        return
      }

      this.updateSong(this.index, values)

      this.alert_variant = 'bg-green-500'
      this.alert_message = 'Success!'
      this.in_submission = false

      this.setUnsavedFlag(false)
    },
    async deleteSong () {
      const storageRef = storage.ref()
      const songRef = storageRef.child(`songs/${this.song.original_name}`)

      await songRef.delete()

      await songsCollection.doc(this.song.docID).delete()

      this.removeSong(this.index)
    }
  }
}
</script>
