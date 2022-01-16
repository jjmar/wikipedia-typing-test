<script>

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TypingTest',
  data () {
    return {
      words: []
    }
  },
  methods: {
    typeLetter (event) {
      console.log(event.key)
    },
    async getArticle () {
      const randomId = Math.floor(Math.random() * 100)
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${randomId}`)
      const body = await response.json()

      this.words = body.title.split(' ')
    }
  }
})

</script>

<template>
<div class='container'>
  <div v-if="words.length">{{words}}</div>
  <input v-on:keydown="typeLetter">
  <button @click="getArticle">Get an article</button>
</div>

</template>

<style lang="scss" scoped>

.container {
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  background: lightgrey;
  padding: 20px;
}

</style>
