<script>

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TypingComponent',
  props: ['timeRemaining']
})
</script>

<template>
  <span class='timer'>
    <template v-if="timeRemaining == 60">1:00</template>
    <template v-else>0:{{timeRemaining}}</template>
  </span>
</template>

<style scoped lang="scss">
.timer {
  color: red;
  font-size: 1.2rem;
}
</style>
