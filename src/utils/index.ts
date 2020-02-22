import axios from 'axios'
import {print} from 'graphql/language/printer'
import {getQueryParams} from 'mingutils'
import {path} from 'ramda'
import createLogger from 'if-logger'
import {pipe, propEq, curry, findIndex, remove, update, find} from 'ramda'

const url: any = {
  // 2019년 prod 백엔드
  prod: 'https://little-jesus-api.now.sh',

  // 2020년 prod 백엔드
  prod2020: 'https://little-jesus-api-git-lj2020.min1.now.sh',

  // 개발서버
  dev: 'https://little-jesus-api-git-develop.min1.now.sh',

  // 로컬서버
  local: 'http://localhost:5050',
}
let BASEURL = url.dev

export function setApiServer() {
  const l = createLogger()
  const queryParam = getQueryParams(window.location.href)
  if (queryParam.api) {
    BASEURL = url[queryParam.api]
  }
  l.info('api-server: ' + BASEURL)
}

export async function req(query: any, variables = {}) {
  let config = {headers: {'Content-Type': 'application/json'}}
  const result = await axios.post(BASEURL, {query: print(query), variables}, config)
  if (result.data.errors) {
    throw result.data.errors
  }
  return result.data.data
}

export function ascending(path: any) {
  return (a: any, b: any) => {
    if (path(a) > path(b)) return 1
    if (path(b) > path(a)) return -1
    return 0
  }
}

export const _idAscending = ascending(path(['_id']))
export const nameAscending = ascending(path(['name']))

export const idEqual = propEq('_id')

export const findById = pipe(
  idEqual,
  find,
)

export const updateBy = curry((pred, tobe) => {
  return list => {
    const index = findIndex(pred)(list)
    return update(index, tobe)(list)
  }
})

export const removeBy = pred => {
  return list => {
    const index = findIndex(pred)(list)
    return remove(index, 1)(list)
  }
}

// export const updateById = curry((id, tobe, list) => {
//   return updateBy(idEqual(id))(tobe)(list)
// })

// export const removeById = curry((id, list) => {
//   return removeBy(idEqual(id))(list)
// })
