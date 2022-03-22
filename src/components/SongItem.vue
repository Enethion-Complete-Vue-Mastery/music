<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div>
      <RouterLink
        :to="{ name: 'song', params: { id: song.docID } }"
        class="font-bold block text-gray-600"
        v-text="song.modified_name"
      />
      <span class="text-gray-500 text-sm" v-text="song.display_name" />
    </div>

    <div class="text-gray-600 text-lg">
      <span class="comments">
        <i class="fa fa-comments text-gray-600"></i>
        {{ song.comment_count }}
      </span>
    </div>
  </li>
</template>

<script>
export default {
  name: 'AppSongItem',
  props: {
    song: {
      required: true,
      type: Object
    }
  }
}
</script>
