import {expect} from 'chai'
import {sort} from 'ramda'
import {nameAscending} from '../../src/utils'

describe('utils', () => {
  describe('nameAscending', () => {
    it('should be array sorted name ascending', () => {
      const arr = [{name: 'egh'}, {name: 'fwedf'}, {name: 'newf'}, {name: 'agb'}]
      const sorted = sort(nameAscending)(arr)
      expect(sorted).to.be.deep.equal([
        {name: 'agb'},
        {name: 'egh'},
        {name: 'fwedf'},
        {name: 'newf'},
      ])
    })
  })
})
