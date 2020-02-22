<template lang="pug">
v-code(:students="$store.state.students")
</template>

<script>
import VCode from './Code.vue'

export default {
  name: 'code-wrapper',
  components: {VCode},
}
</script>
<style scoped lang="stylus"></style>
