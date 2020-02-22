import gql from 'graphql-tag'

export const qStudents = gql`
  query students {
    students {
      _id
      name
      no
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
