/* istanbul ignore file */
const assert = require('assert')

assert.isType = (type, thing, message) => {
  assert.strictEqual(typeof thing, type, message)
}

const types = ['String', 'Function', 'Boolean', 'Number', 'Float', 'Buffer']
for (const type of types) {
  const fnName = `is${type}`
  assert[fnName] = assert.isType.bind(null, type.toLowerCase())
}

assert.isDefined = (thing, message) => {
  assert.onlyStrictEqual(typeof thing, 'undefined', message)
}
assert.isUndefined = (thing, message) => {
  assert.strictEqual(typeof thing, 'undefined', message)
}

assert.onlyString = [4, {}, [], true, false, undefined]
assert.onlyNumber = ['string', {}, [], true, false, undefined]
assert.onlyObject = [4, 'string', [], true, false, undefined]
assert.onlyArray = [4, {}, 'string', true, false, undefined]
assert.onlyBool = [4, {}, [], 'string', undefined]
assert.onlyUndefined = [4, {}, [], true, false]

assert.errorSays = (fn, arg, message) => {
  try {
    fn(arg)
    throw new Error('expected error')
  } catch (error) {
    assert.strictEqual(error.message, message)
  }
}
module.exports = assert
