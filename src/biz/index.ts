import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import createLogger from 'if-logger'
import {getQueryParams, onlyOneInvoke, oneOf} from 'mingutils'
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
  prod2020: 'https://little-jesus-api-git-lj2020.min1.vercel.app',
  prod2021: 'https://little-jesus-api-git-main.min1.vercel.app',
  dev: 'https://little-jesus-api-git-develop.min1.vercel.app',
  local: 'http://localhost:5050',
}

let BASEURL = url.dev
export function setApiServer() {
  const logger = createLogger().addTags('setApiServer')
  // logger.verbose('window.location.host =', window.location.host)
  const queryParam = getQueryParams(window.location.href)
  // logger.verbose('queryParam.api =', queryParam.api)

  BASEURL = oneOf([
    [queryParam.api, url[queryParam.api]],
    [window.location.host.includes('localhost'), url.local],
    [
      [
        'little-jesus-code.vercel.app',
        'little-jesus-2020.vercel.app',
        'little-jesus-admin-2020.vercel.app',
      ].includes(window.location.host),
      url.prod2020,
    ],
    [
      [
        'little-jesus.vercel.app',
        'little-jesus-admin.vercel.app',
        'little-jesus-2021.vercel.app',
        'little-jesus-admin-2021.vercel.app',
      ].includes(window.location.host),
      url.prod2021,
    ],
    [true, url.dev],
  ])

  logger.info('api-server: ' + BASEURL)
}

let reqCount = 0

export async function req(query: any, variables = {}) {
  await checkLocalServer()
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

export const checkLocalServer = onlyOneInvoke(async () => {
  const logger2 = logger.addTags('checkLocalServer')
  try {
    if (BASEURL !== url.local) {
      return
    }
    await checkServerEnable(url.local)
  } catch (e) {
    logger2.warn('Local api server is disable. so connect to dev server')
    BASEURL = url.dev
    logger2.info('api-server: ' + BASEURL)
  }
})

export const checkServerEnable = async url => {
  await axios.post(url, {query: print(qSchema)}, {headers: {'Content-Type': 'application/json'}})
}

export function isProd() {
  const prodHosts = [
    'little-jesus-code.vercel.app',
    'little-jesus-2020.vercel.app',
    'little-jesus-admin-2020.vercel.app',
    'little-jesus-2021.vercel.app',
    'little-jesus-admin-2021.vercel.app',
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
