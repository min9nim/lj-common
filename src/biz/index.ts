import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import createLogger from 'if-logger'
import {getQueryParams} from 'mingutils'
import axios from 'axios'
import {print} from 'graphql/language/printer'
import gql from 'graphql-tag'
import {qSchema} from './query'

export const logger = createLogger().addTags('common')

export function initSentry(Vue) {
  if (!isProd()) {
    logger.addTags('initSentry').debug('[dev] Sentry is not initialized')
    return
  }
  const {
    VUE_APP_SENTRY_DSN = 'https://0900362973204fe39f4d3c815e03ec9e@sentry.io/1839663',
  } = process.env
  logger.info('sentry-dsn:', VUE_APP_SENTRY_DSN)
  Sentry.init({
    dsn: VUE_APP_SENTRY_DSN,
    integrations: [new Integrations.Vue({Vue, attachProps: true, logErrors: true})],
  })
  logger.addTags('initSentry').info('Sentry initialized')
}

const url: any = {
  // 운영서버(master)
  prod: 'https://little-jesus-api.now.sh',

  // 2019년 prod 백엔드
  prod2019: 'little-jesus-api-2019.now.sh',

  // 2020년 prod 백엔드
  // prod2020: 'https://little-jesus-api-git-lj2020.min1.now.sh',
  prod2020: 'little-jesus-api-2020.now.sh',

  // 개발서버
  // dev: 'https://little-jesus-api-git-develop.min1.now.sh',
  dev: 'https://little-jesus-api-dev.now.sh',

  // 로컬서버
  local: 'http://localhost:5050',
}
let BASEURL = url.dev

export function setApiServer() {
  const logger = createLogger().addTags('setApiServer')
  // logger.verbose('window.location.host =', window.location.host)
  if (window.location.host.includes('localhost')) {
    BASEURL = url.local
  }
  if (['little-jesus.now.sh', 'little-jesus-admin.now.sh'].includes(window.location.host)) {
    BASEURL = url.prod2019
  }

  if (isProd()) {
    BASEURL = url.prod2020
  }

  const queryParam = getQueryParams(window.location.href)
  // logger.verbose('queryParam.api =', queryParam.api)
  if (queryParam.api) {
    BASEURL = url[queryParam.api]
  }
  logger.info('api-server: ' + BASEURL)
}

let reqCount = 0

export async function req(query: any, variables = {}) {
  if (BASEURL === url.local) {
    await checkServerAndReplace()
  }
  const logger2 = logger.addTags('req', queryName(print(query)), String(reqCount))
  reqCount++
  logger2.verbose('start')
  logger2.verbose.time('end:')
  let config = {headers: {'Content-Type': 'application/json'}}
  const result = await axios.post(BASEURL, {query: print(query), variables}, config)
  logger2.verbose.timeEnd('end:')
  if (result.data.errors) {
    throw result.data.errors
  }
  return result.data.data
}

export async function checkServerAndReplace() {
  const logger2 = logger.addTags('checkServerAndReplace')
  try {
    await axios.post(
      BASEURL,
      {query: print(qSchema)},
      {headers: {'Content-Type': 'application/json'}},
    )
  } catch (e) {
    logger2.warn('api server is disable. so connect to dev server')
    BASEURL = url.dev
    logger2.info('api-server: ' + BASEURL)
    return
  }
}

export function isProd() {
  const prodHosts = [
    'little-jesus-code.now.sh',
    'little-jesus-2020.now.sh',
    'little-jesus-admin-2020.now.sh',
  ]
  return prodHosts.includes(window.location.host)
}

export function queryName(query: string) {
  try {
    const parsed: any = gql(query)
    if (parsed) {
      // logger.debug('parsed:', parsed.definitions)
      const name = parsed.definitions[0].name
      if (name) {
        return name.value
      }
    }
  } catch (e) {
    logger.warn(e)
  }

  // eslint-disable-next-line no-useless-escape
  const regexp = /{\n?([^\({]+)[{\(]/i
  const result = query.match(regexp)
  if (!result) {
    logger.warn('Failed to find queryName in query')
    logger.warn('req.body.query:', query)
    return
  }
  const queryName = result[1].trim()
  const arr = queryName.split(':')
  if (arr[1]) {
    return arr[1].trim()
  }
  return queryName
}
