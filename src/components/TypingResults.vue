<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TypingResults',
  props: ['numSuccess', 'numError', 'numPresses'],
  computed: {
    accuracy() {
      return (this.numSuccess / this.numPresses) * 100
    }
  }
})
</script>

<template>
  <div>numSuccess: {{numSuccess}}</div>
  <div>numError: {{numError}}</div>
  <div>numPresses: {{numPresses}}</div>
  <div>accuracy: {{accuracy}}</div>
</template>

<style scoped lang="scss">

</style>
