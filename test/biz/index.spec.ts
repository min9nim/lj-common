import {expect} from 'chai'
import {sortKeys} from 'mingutils'

describe('biz', () => {
  describe('sortKeys', () => {
    it('should be returned object which of key sorted', () => {
      const obj = {
        c: 1,
        b: 2,
        a: 3,
      }
      expect(Object.keys(obj)).to.be.deep.equal(['c', 'b', 'a'])
      const sorted = sortKeys(obj)
      expect(Object.keys(sorted)).to.be.deep.equal(['a', 'b', 'c'])
    })
  })
})
