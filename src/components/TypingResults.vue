<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TypingResults',
  props: ['numSuccess', 'numErrors', 'numPresses'],
  computed: {
    accuracy() {
      return (this.numSuccess / this.numPresses) * 100
    }
  }
})
</script>

<template>
  <div>numSuccess: {{numSuccess}}</div>
  <div>numErrors: {{numErrors}}</div>
  <div>numPresses: {{numPresses}}</div>
  <div>accuracy: % {{accuracy}}</div>
</template>

<style scoped lang="scss">

</style>
