<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TypingResults',
  props: ['stats']
})
</script>

<template>
  <div>numWords: {{stats.numWords}}</div>
  <div>numErrors: {{stats.numErrors}}</div>
  <div>numSuccess: {{stats.numSuccess}}</div>
  <div>timeRemaining: {{stats.timeRemaining}}</div>
</template>

<style scoped lang="scss">

</style>
