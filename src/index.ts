import VCode from './views/Code.vue'
import {
  removeBy,
  _idAscending,
  nameAscending,
  idEqual,
  findById,
  updateBy,
  updateById,
  ascending,
  removeById,
  exclude,
  errMsg,
} from './utils'
import createLogger from 'if-logger'
import {setApiServer, initSentry, req, isProd, checkLocalServer} from './biz'
// export * from './utils'  // 이렇게는 처리가 안 됨

export {
  VCode,
  setApiServer,
  req,
  removeBy,
  nameAscending,
  idEqual,
  findById,
  updateBy,
  updateById,
  ascending,
  removeById,
  exclude,
  errMsg,
  isProd,
  initSentry,
  checkLocalServer,
  createLogger,
}
