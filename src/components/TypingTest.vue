<script>

import { defineComponent } from 'vue'
import TypingResults from './TypingResults.vue'

export default defineComponent({
  components: { TypingResults },
  name: 'TypingTest',
  data () {
    return {
      wordsToType: [],
      currentWordIndex: 0,
      gameState: 'ready', // 'ready' -> 'running' -> 'finished' -> 'ready' -> etc
      stats: {
        numErrors: 0,
        numSucceses: 0,
        numWords: 0,
        numWordsAttempted: 0
      }
    }
  },
  async created() {
    await this.getWordsToType()
  },
  methods: {
    typeLetter(event) {
      if (this.isGameReady) this.startGame()

      if (event.code === 'Space') this.moveToNextWord(event)

      if (this.userFinishedTyping) this.stopGame()
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
      console.log('start')
      this.gameState = 'running'
      this.currentWordIndex = 0
      this.stats = { numErrors: 0, numSucceses: 0, numWords: 0, numWordsAttempted: 0 }
    },
    stopGame() {
      this.stats = this.generateStats()
      this.gameState = 'finished'
    },
    generateStats() {
      return {
        numErrors: this.wordsToType.filter(w => w.state === 'error').length,
        numSuccess: this.wordsToType.filter(w => w.state === 'success').length,
        numWords: this.wordsToType.length,
        numWordsAttempted: this.currentWordIndex
      }
    }
  },
  computed: {
    isGameRunning() {
      return this.gameState === 'running'
    },
    isGameReady() {
      return this.gameState === 'ready'
    },
    isGameFinished() {
      return this.gameState === 'finished'
    },
    userFinishedTyping() {
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
  <div class='game' v-if="!isGameFinished">
    <div class='words' v-if="wordsToType.length">
      <span class='word' :class="{'word-error': wordObject.state == 'error', 'word-success':  wordObject.state == 'success', 'word-active': wordObject == currentWordObject }" v-for="wordObject in wordsToType" :key="wordObject.index">{{wordObject.word}}</span>
    </div>
    <input ref="wordInput" class='word-input' @keydown="typeLetter">
    <button @click="getWordsToType">Get an article</button>
  </div>
  <typing-results v-else :stats="stats"/>

  <div>currentWord: {{wordsToType[currentWordIndex]?.word}}</div>
  <div>userFinishedTyping: {{ userFinishedTyping }}</div>
  <div>isGameRunning: {{ isGameRunning }}</div>
  <div>gameState: {{ gameState }}</div>
</div>

</template>

<style lang="scss" scoped>

.container {
  border-radius: 15px;
  background: lightgrey;
  padding: 20px;
}

.game {
  display: flex;
  flex-direction: column;
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
