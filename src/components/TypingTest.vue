<script>

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TypingTest',
  data () {
    return {
      wordsToType: [],
      currentWordIndex: -1
    }
  },
  async created() {
    await this.getWordsToType()
  },
  methods: {
    typeLetter(event) {
      if (!this.isGameRunning) this.startGame()

      if (event.code === 'Space') this.moveToNextWord(event)

      if (!this.isGameRunning) this.restartGame()
    },
    async getWordsToType() {
      const randomId = Math.floor(Math.random() * 100)
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${randomId}`)
      const body = await response.json()

      const words = body.title.split(' ')
      this.wordsToType = words.map((word, index) => ({ word, index, state: 'untyped' }))
    },
    moveToNextWord(event) {
      const enteredWord = this.$refs.wordInput.value
      const expectedWordObj = this.currentWordObject

      if (enteredWord !== expectedWordObj.word) {
        expectedWordObj.state = 'error'
      } else {
        expectedWordObj.state = 'success'
      }

      event.preventDefault()
      this.$refs.wordInput.value = ''
      this.currentWordIndex++
    },
    startGame() {
      this.currentWordIndex = 0
    },
    restartGame() {
      this.currentWordIndex = -1
      this.getWordsToType()
    }
  },
  computed: {
    isGameRunning() {
      if (!this.userStartedTyping) return false
      if (this.userFinishedTyping) return false

      return true
    },
    userStartedTyping() {
      return this.currentWordIndex >= 0
    },
    userFinishedTyping() {
      if (!this.userStartedTyping) return false

      return this.currentWordIndex > this.wordsToType.length - 1
    },
    currentWordObject() {
      if (!this.isGameRunning) return ''

      return this.wordsToType[this.currentWordIndex]
    }
  }
})

</script>

<template>
<div class='container'>
  <div class='words' v-if="wordsToType.length">
    <span class='word' :class="{'word-error': wordObject.state == 'error', 'word-success':  wordObject.state == 'success', 'word-active': wordObject == currentWordObject }" v-for="wordObject in wordsToType" :key="wordObject.index">{{wordObject.word}}</span>
  </div>
  <input ref="wordInput" class='word-input' @keydown="typeLetter">
  <button @click="getWordsToType">Get an article</button>

  <div>currentWord: {{wordsToType[currentWordIndex]?.word}}</div>
  <div>userStartedTyping: {{ userStartedTyping }}</div>
  <div>userFinishedTyping: {{ userFinishedTyping }}</div>
  <div>isGameRunning: {{ isGameRunning }}</div>
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

.words {
  word-wrap: break-word;
  line-height: 2rem;
  font-size: 2rem;
}

.word-input {
  font-size: 2rem;
}

.word {
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
