import gql from 'graphql-tag'

export const qStudents = gql`
  {
    students {
      _id
      name
      no
    }
  }
`

export const qCheckAttendance = gql`
  mutation checkAttendance($owner: ObjectId!, $date: String!) {
    checkAttendance(owner: $owner, date: $date) {
      _id
      owner
      date
      items {
        type
        value
      }
      etc
    }
  }
`

export const qUpdateStudent = gql`
  mutation updateStudent($_id: ObjectId!, $no: String) {
    res: updateStudent(_id: $_id, no: $no) {
      _id
      name
      no
    }
  }
`
