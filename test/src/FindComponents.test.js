process.env.DURP_NAME = 'bean.json'
const assert = require('../../helpers/TestHelpers')
const rewire = require('rewire')
const sinon = require('sinon')
const { findComponents, isComponent, validateComponent, sortFileTypes } = require('../../src/FindComponents')

describe('FindComponents', () => {
  it('should be a function', () => {
    assert.isFunction(findComponents, 'expected FindComponents to export a function')
  })

  it('should accept a filepath that it validates as a string', () => {
    for (const badType of assert.onlyString) {
      assert.errorSays(
        findComponents,
        badType,
        `[findComponents] argument must be a filepath of type string, found type: ${typeof badType}`
      )
    }
  })

  it('should only return a sortedFileTypes object if a path has a bean.json', () => {
    const compPath = __dirname + '/../examples/componentStructure/testComponentDir2/aComponent/'
    const res = findComponents(compPath)
    assert.deepEqual(res, [{
      dirs: [
        'storage'
      ],
      gql: [
        'LilBean.gql'
      ],
      graphql: [
        'BigBean.graphql'
      ],
      json: [
        process.env.DURP_NAME,
        'config.json'
      ],
      path: '/home/brucer/Repos/durp/test/src/../examples/componentStructure/testComponentDir2/aComponent/'
    }])
    // const notCompPath = __dirname + '/../examples/componentStructure/testComponentDir1/notAComponent/'
    // res = findComponents(notCompPath)
    // assert.deepEqual(res, {})
  })

  it('should not return an organized object of the path\'s contents if it is not a component', () => {
    const notCompPath = __dirname + '/../examples/componentStructure/testComponentDir1/notAComponent/'
    const res = findComponents(notCompPath)
    assert.deepEqual(res, [])
  })

  it('should recursively call itself and return all sorted component objects in a single array', () => {
    const projPath = __dirname + '/../examples/componentStructure/testComponentDir2/'
    const res = findComponents(projPath)
    assert.deepEqual(res, [
      {
        dirs: [
          'storage'
        ],
        gql: [
          'LilBean.gql'
        ],
        graphql: [
          'BigBean.graphql'
        ],
        json: [
          process.env.DURP_NAME,
          'config.json'
        ],
        path: '/home/brucer/Repos/durp/test/src/../examples/componentStructure/testComponentDir2/aComponent'
      }])
  })

  it('should recursively call itself and return sorted component objects in a single array', () => {
    const projPath = __dirname + '/../examples/componentStructure/testComponentDir3/'
    const res = findComponents(projPath)
    assert.deepEqual(res, [
      {
        dirs: [
          'storage'
        ],
        gql: [
          'LilBean.gql'
        ],
        graphql: [
          'BigBean.graphql'
        ],
        json: [
          process.env.DURP_NAME,
          'config.json'
        ],
        path: '/home/brucer/Repos/durp/test/src/../examples/componentStructure/testComponentDir3/aComponent'
      },
      {
        dirs: [
          'storage'
        ],
        gql: [
          'LilBean.gql'
        ],
        graphql: [
          'BigBean.graphql'
        ],
        json: [
          process.env.DURP_NAME,
          'config.json'
        ],
        path: '/home/brucer/Repos/durp/test/src/../examples/componentStructure/testComponentDir3/aComponent2'
      }])
  })

  it('should recursively call itself and return all 4 sorted component objects in a single array', () => {
    const projPath = __dirname + '/../examples/componentStructure/testComponentDir4/'
    const res = findComponents(projPath)
    assert.deepEqual(res, [
      {
        dirs: [
          'storage'
        ],
        gql: [
          'LilBean.gql'
        ],
        graphql: [
          'BigBean.graphql'
        ],
        json: [
          process.env.DURP_NAME,
          'config.json'
        ],
        path: '/home/brucer/Repos/durp/test/src/../examples/componentStructure/testComponentDir4/aComponent'
      },
      {
        dirs: [
          'storage'
        ],
        gql: [
          'LilBean.gql'
        ],
        graphql: [
          'BigBean.graphql'
        ],
        json: [
          process.env.DURP_NAME,
          'config.json'
        ],
        path: '/home/brucer/Repos/durp/test/src/../examples/componentStructure/testComponentDir4/aComponent2'
      },
      {
        dirs: [
          'storage'
        ],
        gql: [
          'LilBean.gql'
        ],
        graphql: [
          'BigBean.graphql'
        ],
        json: [
          process.env.DURP_NAME,
          'config.json'
        ],
        path: '/home/brucer/Repos/durp/test/src/../examples/componentStructure/testComponentDir4/another_random_subdir/aComponent4'
      },
      {
        dirs: [
          'storage'
        ],
        gql: [
          'LilBean.gql'
        ],
        graphql: [
          'BigBean.graphql'
        ],
        json: [
          process.env.DURP_NAME,
          'config.json'
        ],
        path: '/home/brucer/Repos/durp/test/src/../examples/componentStructure/testComponentDir4/random_subdir/aComponent3'
      }
    ])
  })

  describe('isComponent', () => {
    it('should be a function', () => {
      assert.isFunction(isComponent, 'expected isComponent to be a function')
    })
    it('should throw an error if its argument is not a string', () => {
      for (const badType of assert.onlyString) {
        assert.errorSays(
          isComponent,
          badType,
          `[isComponent] argument must be a filepath of type string, found type: ${typeof badType}`
        )
      }
    })
    it('should return a path if directory contains a bean.json file', () => {
      const aComp = __dirname + '/../examples/componentStructure/testComponentDir1/aComponent'
      const res = isComponent(aComp)
      assert.deepEqual(res, aComp)
    })
    it('should return false if directory does not contain a bean.json file', () => {
      const res = isComponent(__dirname + '/../examples/componentStructure/testComponentDir1/notAComponent/')
      assert.strictEqual(res, false)
    })
  })

  describe('sortFileTypes', () => {
    it('should be a function', () => {
      assert.isFunction(sortFileTypes)
    })
    it('should return an object containing a path attribute representing the organizational root', () => {
      const notCompPath = __dirname + '/../examples/componentStructure/testComponentDir1/notAComponent/'
      let res = sortFileTypes(notCompPath)
      assert.strictEqual(res.path, notCompPath)
      const compPath = __dirname + '/../examples/componentStructure/testComponentDir1/aComponent/'
      res = sortFileTypes(compPath)
      assert.strictEqual(res.path, compPath)
    })

    describe('should build arrays of', () => {
      it('json files', () => {
        const compPath = __dirname + '/../examples/componentStructure/testComponentDir1/aComponent'
        let res = sortFileTypes(compPath)
        assert.deepEqual(res.json, [process.env.DURP_NAME])
        const compPath2 = __dirname + '/../examples/componentStructure/testComponentDir2/aComponent/'
        res = sortFileTypes(compPath2)
        assert.deepEqual(res.json.sort(), [process.env.DURP_NAME, 'config.json'])
      })
      it('directories', () => {
        const dir1 = __dirname + '/../examples/componentStructure/testComponentDir1/'
        const res = sortFileTypes(dir1)
        assert.deepEqual(res.dirs.sort(), ['aComponent', 'notAComponent'])
      })
      it('graphql and gql files', () => {
        const dir2Comp = __dirname + '/../examples/componentStructure/testComponentDir2/aComponent'
        const res = sortFileTypes(dir2Comp)
        assert.deepEqual(res.gql.sort(), ['LilBean.gql'])
        assert.deepEqual(res.graphql.sort(), ['BigBean.graphql'])
      })
      it('js files', () => {
        const dir2Comp = __dirname + '/../examples/componentStructure/testComponentDir2/aComponent/storage/aws'
        const res = sortFileTypes(dir2Comp)
        assert.deepEqual(res.js.sort(), ['beanResolver1.js', 'beanResolver2.js'])
      })
    })
  })

  describe('validateComponent', () => {
    it('should be a function', () => {
      assert.isFunction(validateComponent, 'expected validateComponent to be a function')
    })
    it('should throw an error if a filepath is not a string', () => {
      for (const badType of assert.onlyString) {
        assert.errorSays(
          validateComponent,
          badType,
          `[validateComponent] argument must be a filepath of type string, found type: ${typeof badType}`
        )
      }
    })
    describe('should throw an error if component', () => {
      it('is missing a bean.json', () => {
        const path = __dirname + '/../examples/componentStructure/testComponentDir1/notAComponent/'
        assert.errorSays(
          validateComponent,
          path,
          `expected path to contain a bean.json file:\n${path}\n`
        )
      })
      it('has no .gql or .graphql files', () => {
        const path = __dirname + '/../examples/componentStructure/testComponentDir1/aComponent/'
        assert.errorSays(
          validateComponent,
          path,
          `no gql or graphql models found in path: ${path}`
        )
      })
    })
  })
})
