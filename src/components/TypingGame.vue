<script>

import { defineComponent } from 'vue'
import TypingResults from './TypingResults.vue'
import TypingInput from './TypingInput.vue'
import TypingWords from './TypingWords.vue'
import getRandomWikipediaArticle from '../services/wikipedia.js'

export default defineComponent({
  name: 'TypingGame',
  components: {
    TypingResults,
    TypingInput,
    TypingWords
  },
  data () {
    return {
      articleTitle: '',
      articleId: 0,
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
      const articleDetails = await getRandomWikipediaArticle()

      this.articleTitle = articleDetails.title
      this.articleId = articleDetails.id
      this.wordsToType = articleDetails.words.map((word, index) => ({ word, index, state: 'untyped' }))
    },
    moveToNextWord(event) {
      const inputElement = event.srcElement
      const enteredWord = inputElement.value
      const expectedWordObj = this.currentWordObject

      expectedWordObj.state = enteredWord === expectedWordObj.word ? 'success' : 'error'

      event.preventDefault()
      inputElement.value = ''

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
      this.setInitialGameState()
    },
    async restartGame() {
      this.gameState = 'stopped'
      await this.getWordsToType()
      this.setInitialGameState()
    },
    stopGame() {
      this.gameState = 'finished'
    },
    setInitialGameState() {
      this.currentWordIndex = 0
      this.stats = { numErrors: 0, numSuccess: 0, numPresses: 0 }
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
    <typing-words :articleTitle="articleTitle" :articleId="articleId" :wordsToType="wordsToType" :currentWordObject="currentWordObject"/>
    <typing-input v-on:typeLetter="typeLetter" v-on:restartGame="restartGame"/>
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
</style>
