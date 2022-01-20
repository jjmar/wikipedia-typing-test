<script>

import { defineComponent } from 'vue'
import TypingResults from './TypingResults.vue'
import TypingInput from './TypingInput.vue'
import TypingWords from './TypingWords.vue'
import TypingTimer from './TypingTimer.vue'

import getRandomWikipediaArticle from '../services/wikipedia.js'

export default defineComponent({
  name: 'TypingGame',
  components: {
    TypingResults,
    TypingInput,
    TypingWords,
    TypingTimer
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
      },
      timer: {
        id: '',
        timeRemaining: 60
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
        if (this.userFinishedTyping) this.finishGame()
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
      this.timer.id = setInterval(this.decrementTimer, 1000)
    },
    async restartGame() {
      this.gameState = 'ready'
      clearInterval(this.timer.id)
      await this.getWordsToType()
      this.setInitialGameState()
    },
    finishGame() {
      this.gameState = 'finished'
      clearInterval(this.timer.id)
    },
    setInitialGameState() {
      this.currentWordIndex = 0
      this.stats = { numErrors: 0, numSuccess: 0, numPresses: 0 }
      this.timer = { id: '', timeRemaining: 60 }
    },
    isFunctionKey(code) {
      if (code === 'Backspace') return false
      if (code === 'Space') return false
      if (code === 'CapsLock') return false
      if (code.includes('Shift')) return false

      return true
    },
    decrementTimer() {
      this.timer.timeRemaining--

      if (this.timer.timeRemaining > 0) return

      this.finishGame()
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
    <div class='controls'>
      <typing-timer :timeRemaining="timer.timeRemaining"/>
      <font-awesome-icon @click="restartGame" icon="sync" size="2x" />
    </div>
    <typing-words :articleTitle="articleTitle" :articleId="articleId" :wordsToType="wordsToType" :currentWordObject="currentWordObject"/>
    <typing-input v-on:typeLetter="typeLetter" v-on:restartGame="restartGame" :isGameRunning="isGameRunning"/>
  </div>
  <typing-results v-else v-bind="stats"/>
</div>

</template>

<style lang="scss" scoped>

.container {
  border-radius: 15px;
  background: lightgrey;
  padding: 20px;
  border: 2px solid black;
}

.game {
  display: flex;
  flex-direction: column;
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  svg {
    cursor: pointer;
    color: green;
  }
}
</style>
