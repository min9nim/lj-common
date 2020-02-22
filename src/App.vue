<template lang="pug">
#app
  #nav
    el-tabs(v-model="state.activeName" @tab-click="handleClick")
      el-tab-pane(label="메인" name="/")
      el-tab-pane(label="코드매핑" name="/code")
  router-view  
</template>
<script lang="ts">
import {reactive, onMounted, onBeforeMount} from '@vue/composition-api'
import Vue from 'vue'
import {req} from './biz'
import {qStudents, qUpdateStudent} from './biz/query'
import createLogger from 'if-logger'
import {codeMap} from './biz/codeMap'
import {go} from 'mingutils'
import {prop, find, propEq, sort} from 'ramda'

const logger = createLogger({tags: ['App.vue']})

function nameAscending(a: any, b: any) {
  if (a.name > b.name) return 1
  if (b.name > a.name) return -1
  return 0
}

export default {
  setup(props: any, {root}: any) {
    const state = reactive({
      students: [],
      loading: false,
      activeName: location.pathname,
    })
    onBeforeMount(async () => {
      logger.addTags('onBeforeMount').info('start')
      const result = await req(qStudents)
      const sortedList = sort(nameAscending, result.students)
      // l.debug('result.students', sortedList)

      const studentList = sortedList.map(student => ({...student, editable: false, loading: false}))

      root.$store.commit('setStudents', studentList)

      // console.log(JSON.stringify(studentList, null, 2))

      // 코드값 초기화
      if (root.$route.query.codeSet === 'true') {
        root.$store.state.students.forEach(student => {
          const matched = Object.entries(codeMap).find(([key, value]) => value === student.name)
          logger.addTags('onBeforeMount').info(student.name, student._id, matched && matched[0])
          if (matched) {
            req(qUpdateStudent, {_id: student._id, no: matched[0]})
          }
        })
      }
    })
    return {
      state,
      handleClick(tab: any, event: any) {
        if (location.pathname === tab.name) {
          return
        }
        root.$router.push(tab.name)
      },
    }
  },
}
</script>
<style lang="stylus" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}
</style>
<style lang="stylus" >
#nav {
  // text-align: center;
  a {
    margin: 0 5px;
    font-weight: bold;
    color: #2c3e50;
  }

  a.router-link-exact-active {
    color: #42b983;
  }

  .el-tabs__item {
    padding: 0 10px;
    height: 35px;
  }
}

.home {
  .form {
    .item {
      .el-radio__label {
        font-size: 14px;
      }
    }
  }
}

#app {
  .el-card {
    // border: 5px solid #f1f1f1;
    .el-card__header {
      padding: 10px 10px;
      background-color: #f9f9f9;
    }

    .el-card__body {
      padding: 10px 10px;
    }
  }

  .el-input--prefix .el-input__inner {
    cursor: pointer;
  }

  .el-table__header {
    thead {
      tr {
        th {
          background-color: #f9f9f9;
        }
      }
    }
  }
}

.red {
  color: red;
}

.green {
  color: green;
}
</style>
