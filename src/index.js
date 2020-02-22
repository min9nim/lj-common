import VCode from './views/Code.vue'
import {
  setApiServer,
  req,
  removeBy,
  _idAscending,
  nameAscending,
  idEqual,
  findById,
  updateBy,
} from './utils'
// export * from './utils'  // 이렇게는 처리가 안 됨

export {VCode, setApiServer, req, removeBy, nameAscending, idEqual, findById, updateBy}
