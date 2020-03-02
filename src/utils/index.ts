// import path from 'ramda/es/path'
import {path} from 'ramda'
// import {pipe, propEq, curry, findIndex, remove, update, find, complement, filter} from 'ramda'

export * from 'mingutils'

export function ascending(path: any) {
  return (a: any, b: any) => {
    if (path(a) > path(b)) return 1
    if (path(b) > path(a)) return -1
    return 0
  }
}

export const _idAscending = ascending(path(['_id']))
export const nameAscending = ascending(path(['name']))

// export const idEqual = propEq('_id')

// export const findById = pipe(
//   idEqual,
//   find,
// )

// export const updateBy = curry((pred, tobe) => {
//   return list => {
//     const index = findIndex(pred)(list)
//     return update(index, tobe)(list)
//   }
// })

// export const updateById = curry((id, tobe, list) => {
//   return updateBy(idEqual(id))(tobe)(list)
// })

// export const removeBy = pred => {
//   return list => {
//     const index = findIndex(pred)(list)
//     return remove(index, 1)(list)
//   }
// }

// export const removeById = curry((id, list) => {
//   return removeBy(idEqual(id))(list)
// })

// export const exclude = pipe<any, any, any>(
//   complement,
//   filter,
// )

export const errMsg = e => (Array.isArray(e) ? e[0].message : e.message)
