<template lang="pug">
v-code(:students="$store.state.students")
</template>

<script>
import {createComponent, onMounted, watch} from '@vue/composition-api'
import {remove, equals, propEq, eqProps, clone, find} from 'ramda'
import {exclude} from 'mingutils'
import useIntervalCall from 'interval-call'
// import {IStudent} from '../biz/type'
import {reactive} from '@vue/composition-api'
import {req} from '../utils'
import {qUpdateStudent} from '../biz/query'
import {MessageBox, Notification} from 'element-ui'
import createLogger from 'if-logger'
import {go} from 'mingutils'
import Vue from 'vue'
import VCode from './Code.vue'

export default {
  name: 'v-index',
  components: {VCode},
}
</script>
<style scoped lang="stylus"></style>
