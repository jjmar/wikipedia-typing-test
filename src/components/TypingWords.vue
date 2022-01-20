<script>

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TypingWords',
  props: ['articleTitle', 'articleId', 'wordsToType', 'currentWordObject'],
  computed: {
    linkToArticle() {
      return `http://en.wikipedia.org/?curid=${this.articleId}`
    }
  }
})

</script>

<template>
  <h1 class='title'>{{articleTitle}}</h1>
  <a class='link' :href="linkToArticle" target="_blank">link</a>
  <p class='words' v-if="wordsToType.length">
    <span class='word' :class="{'word-error': wordObject.state == 'error', 'word-success':  wordObject.state == 'success', 'word-active': wordObject == currentWordObject }" v-for="wordObject in wordsToType" :key="wordObject.index">{{wordObject.word}}</span>
  </p>
</template>

<style lang="scss" scoped>
.title {
  margin: 0 auto;
}

.link {
  margin: 0 auto;
  font-size: 1rem;
  font-style: italic;
}

.words {
  line-height: 3rem;
  font-size: 2rem;
}

.word {
  display: inline-block;
  margin-right: 5px;
}

.word-error {
  background: red;
}

.word-success {
  background: green;
}

.word-active {
  text-decoration: underline;
}
</style>
