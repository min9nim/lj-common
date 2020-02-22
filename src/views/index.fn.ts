import {reactive} from '@vue/composition-api'
import {IStudent} from '../biz/type'
import {req} from '@/utils'
import {qUpdateStudent} from '@/biz/query'
import {MessageBox, Notification} from 'element-ui'
import createLogger from 'if-logger'
import {propEq, find} from 'ramda'
import {go} from 'mingutils'

const logger = createLogger().addTags('code.fn.ts')

export interface IState {
  loading: boolean
  inputVisible: boolean
  newStudentName: string
  originalStudents: IStudent[]
}

export function useState(): IState {
  return reactive<IState>({
    loading: false,
    inputVisible: false,
    newStudentName: '',
    originalStudents: [],
  })
}

export function useHandleStudentClick({root, refs}: any) {
  return (student: IStudent) => {
    // @ts-ignore
    logger.addTags('useHandleStudentClick').debug(student)
    student.editable = true
    root.$nextTick(() => {
      // console.log(refs, student._id, refs[student._id])
      refs[student._id][0].$refs.input.focus()
    })
  }
}

export function useHandleStudentNameConfirm(state: IState) {
  const l = logger.addTags('useHandleStudentNameConfirm')
  return async (student: IStudent) => {
    try {
      // if (!student.no) {
      //   student.editable = false
      //   return
      // }
      const originalStudent = go(state.originalStudents, find(propEq('_id', student._id)))
      l.verbose(originalStudent.no, student.no)
      if (originalStudent.no === student.no) {
        // 동일한 값이면 그냥 리턴
        student.editable = false
        return
      }

      const sameNoStudent = go(state.originalStudents, find(propEq('no', student.no)))
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
      state.loading = false
      console.error(e)
      MessageBox.alert(e.message, {type: 'warning'})
    }
  }
}
