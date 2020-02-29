import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import createLogger from 'if-logger'
import {getQueryParams} from 'mingutils'
import axios from 'axios'
import {print} from 'graphql/language/printer'

export const logger = createLogger().addTags('common')

export function initSentry(Vue) {
  if (!isProd()) {
    logger.addTags('initSentry').info('[dev] Sentry is not initialized')
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
  const logger = createLogger().addTags('setApiServer')
  // logger.verbose('window.location.host =', window.location.host)
  if (window.location.host.includes('localhost')) {
    BASEURL = url.local
  }
  if (['little-jesus.now.sh', 'little-jesus-admin.now.sh'].includes(window.location.host)) {
    BASEURL = url.prod
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

export async function req(query: any, variables = {}) {
  let config = {headers: {'Content-Type': 'application/json'}}
  const result = await axios.post(BASEURL, {query: print(query), variables}, config)
  if (result.data.errors) {
    throw result.data.errors
  }
  return result.data.data
}

export function isProd() {
  const prodHosts = [
    'little-jesus-code.now.sh',
    'little-jesus-2020.now.sh',
    'little-jesus-admin-2020.now.sh',
  ]
  return prodHosts.includes(window.location.host)
}
