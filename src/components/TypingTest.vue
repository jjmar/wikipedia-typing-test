<script>

import { defineComponent } from 'vue'
import TypingResults from './TypingResults.vue'
import _ from 'lodash'

export default defineComponent({
  components: { TypingResults },
  name: 'TypingTest',
  data () {
    return {
      articleTitle: '',
      wordsToType: [],
      currentWordIndex: 0,
      currentCharacterIndex: 0,
      gameState: 'ready', // 'ready' -> 'running' -> 'finished' -> 'ready' -> etc
      stats: {
        numErrors: 0,
        numSuccess: 0,
        numPresses: 0
      }
    }
  },
  async created() {
    await this.getWordsToType()
  },
  methods: {
    typeLetter(event) {
      if (this.isGameReady) this.startGame()

      if (event.code === 'Space') {
        this.moveToNextWord(event)
        if (this.userFinishedTyping) this.stopGame()
      } else {
        this.moveToNextCharacter(event)
      }
    },
    async getWordsToType() {
      const randomWikipediaURL = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exsentences=20&exintro=&explaintext=&generator=random&grnnamespace=0&origin=*'
      const response = await fetch(randomWikipediaURL)
      const body = await response.json().then(payload => {
        const id = Object.entries(payload.query.pages)[0][0]
        const articleDetails = payload.query.pages[id]

        this.articleTitle = _.deburr(articleDetails.title)
        return articleDetails.extract
      })

      const words = body.split(' ')
      this.wordsToType = words.map((word, index) => ({ word, index, state: 'untyped' }))
    },
    moveToNextWord(event) {
      const enteredWord = this.$refs.wordInput.value
      const expectedWordObj = this.currentWordObject

      expectedWordObj.state = enteredWord === expectedWordObj.word ? 'success' : 'error'

      event.preventDefault()
      this.$refs.wordInput.value = ''

      this.currentWordIndex++
      this.currentCharacterIndex = 0
    },
    moveToNextCharacter(event) {
      const enteredCharacter = event.code
      const expectedCharacter = `Key${this.expectedCharacter.toUpperCase()}`

      if (enteredCharacter === 'Backspace' && this.currentCharacterIndex > 0) {
        this.currentCharacterIndex--
        return
      }

      if (!this.isFunctionKey(enteredCharacter)) return

      if (enteredCharacter === expectedCharacter) this.stats.numSuccess++
      if (enteredCharacter !== expectedCharacter) this.stats.numErrors++

      this.stats.numPresses++

      if (this.currentCharacterIndex !== this.currentWordObject.word.length - 1) this.currentCharacterIndex++
    },
    startGame() {
      this.gameState = 'running'
      this.currentWordIndex = 0
      this.stats = { numErrors: 0, numSuccess: 0, numPresses: 0 } // is this needed if component rerenders?
    },
    stopGame() {
      this.gameState = 'finished'
    },
    isFunctionKey(code) {
      if (code === 'Backspace') return false
      if (code === 'Space') return false
      if (code === 'CapsLock') return false
      if (code.includes('Shift')) return false

      return true
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
      return this.wordsToType[this.currentWordIndex]
    },
    expectedCharacter() {
      if (!this.currentWordObject?.word) return ''

      return this.currentWordObject.word[this.currentCharacterIndex]
    }
  }
})

</script>

<template>
<div class='container'>
  <div class='game' v-if="!isGameFinished">
    <h1>{{articleTitle}}</h1>
    <p class='words' v-if="wordsToType.length">
      <span class='word' :class="{'word-error': wordObject.state == 'error', 'word-success':  wordObject.state == 'success', 'word-active': wordObject == currentWordObject }" v-for="wordObject in wordsToType" :key="wordObject.index">{{wordObject.word}}</span>
    </p>
    <input ref="wordInput" class='word-input' @keydown="typeLetter">
    <button @click="getWordsToType">Get an article</button>
  </div>
  <typing-results v-else v-bind="stats"/>
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
  line-height: 3rem;
  font-size: 2rem;
  word-spacing: 1rem
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
