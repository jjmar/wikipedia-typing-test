<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TypingInput',
  props: ['isGameRunning']
})
</script>

<template>
    <input class='word-input' v-on:keydown="$emit('typeLetter', $event)" :placeholder="!isGameRunning ? 'Start typing to begin' : ''">
    <!-- <button v-on:click="$emit('restartGame')">Grab a new article</button> -->
</template>

<style lang="scss" scoped>
.word-input {
  font-size: 2rem;
  margin: 0 auto;
  width: 60%;
}
</style>
