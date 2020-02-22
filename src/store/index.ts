import Vue from 'vue'
import Vuex from 'vuex'
import {IStudent} from '../biz/type'
import {removeById} from 'mingutils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    date: '',
    students: [] as IStudent[],
  },
  mutations: {
    setStudents(state, students) {
      state.students = students
    },
    addStudent(state, student) {
      state.students.push(student)
    },
    removeStudent(state: any, studentId) {
      state.students = removeById(studentId)(state.students)
    },
  },
  getters: {
    studentMap(state) {
      return state.students.reduce((acc: any, value: any) => {
        acc[value._id] = value
        return acc
      }, {})
    },
  },
  actions: {},
  modules: {},
})
