<template lang="pug">
.home(v-loading='loading')
  h3 코드매핑({{studentList.length}})
  .students
    .student(v-for="(student, index) in studentList" :key="student._id" v-loading="student.loading")
      el-input.input-student-name(
        v-if="student.editable"
        v-model="student.no"
        :ref="student._id"
        size="mini"
        @keyup.enter.native="handleStudentNameConfirm(student)"
        @blur="handleStudentNameConfirm(student)"
      )
      el-tag.studentName(
        v-else
        :disable-transitions="true"
        :type="!student.no ? 'danger' : ''"
        @click="handleStudentClick(student)"
      ) {{student.name}}: {{student.no}}
</template>

<script>
import {createComponent, onMounted, watch} from '@vue/composition-api'
import {remove, equals, propEq, eqProps, clone, find} from 'ramda'
import {exclude} from 'mingutils'
import useIntervalCall from 'interval-call'
import {reactive} from '@vue/composition-api'
import {req} from '../utils'
import {qUpdateStudent} from '../biz/query'
import {MessageBox, Notification} from 'element-ui'
import createLogger from 'if-logger'
import {go} from 'mingutils'
import Vue from 'vue'

const logger = createLogger().addTags('Code.vue')

const intervalCall = useIntervalCall(1000)

export default {
  name: 'v-code',
  props: {
    students: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      studentList: [],
      loading: false,
      inputVisible: false,
      newStudentName: '',
      originalStudents: [],
    }
  },
  methods: {
    handleStudentClick(student) {
      // @ts-ignore
      logger.addTags('useHandleStudentClick').debug(student)
      student.editable = true
      Vue.nextTick(() => {
        this.$refs[student._id][0].$refs.input.focus()
      })
    },
    handleStudentNameConfirm: intervalCall(async function(student) {
      const l = logger.addTags('useHandleStudentNameConfirm')
      try {
        const originalStudent = go(this.originalStudents, find(propEq('_id', student._id)))
        l.verbose(originalStudent.no, student.no)
        if (originalStudent.no === student.no) {
          // 동일한 값이면 그냥 리턴
          student.editable = false
          return
        }

        const sameNoStudent = go(this.originalStudents, find(propEq('no', student.no)))
        if (student.no && sameNoStudent) {
          MessageBox.alert(
            sameNoStudent.name + '의 코드값과 동일합니다. 다른 값을 입력해 주세요',
            '',
            {type: 'warning'},
          )
          student.no = originalStudent.no
          return
        }

        student.loading = true
        await req(qUpdateStudent, {_id: student._id, no: student.no})
        student.loading = false

        // originalStudent.no 재설정
        originalStudent.no = student.no
        // @ts-ignore
        Notification.success({
          message: student.name + '의 코드값(' + student.no + ') 수정 완료',
          position: 'bottom-right',
        })
        student.editable = false
      } catch (e) {
        student.loading = false
        console.error(e)
        MessageBox.alert(e.message, {type: 'warning'})
      }
    }),
  },
  watch: {
    students: {
      deep: true,
      handler(newValue, oldValue) {
        // logger.addTags('watch').debug(newValue, oldValue)
        if (this.studentList.length === 0) {
          logger.addTags('watch').verbose('studentList.length is 0')
          this.originalStudents = clone(this.students)
          this.studentList = clone(this.students)
        }
      },
    },
  },
  mounted() {
    logger.addTags('mounted').debug('call')
    this.originalStudents = clone(this.students)
    this.studentList = clone(this.students)
  },
}
</script>
<style scoped lang="stylus">
.home {
  h3 {
    margin-top: 0;
  }

  // margin: 0 10px;
  padding: 5px;
  text-align: left;

  .students {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .student {
      display: inline-block;
      margin: 3px 4px;
      width: 100px;

      .input-student-name {
        display: inline-block;
        width: 70px;
        height: 32px;
        margin-left: 0;
        vertical-align: bottom;
      }

      .studentName {
        cursor: pointer;

        h4 {
          margin: 10px 0 3px 0;
        }
      }
    }
  }

  .new-student {
    margin: 10px 10px 0 3px;

    .input-new-tag {
      width: 90px;
      margin-left: 0;
      vertical-align: bottom;
    }
  }
}
</style>
