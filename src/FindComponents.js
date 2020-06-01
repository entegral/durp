const assert = require('../helpers/TestHelpers')
const fs = require('fs')

const componentIdentifier = process.env.DURP_NAME || 'bean.json'

const isComponent = (path) => {
  assert.isString(path, `[isComponent] argument must be a filepath of type string, found type: ${typeof path}`)
  const file = path.endsWith('/') ? componentIdentifier : `/${componentIdentifier}`
  try {
    require(path + file)
    return path
  } catch (error) {
    return false
  }
}

const sortFileTypes = (path) => {
  const filesToValidate = {
    path
  }
  const contents = fs.readdirSync(path, { withFileTypes: true })
  for (const content of contents) {
    const [filename, ...ext] = content.name.split('.')
    const extension = content.isFile() ? ext.join('.') : 'dirs'
    if (!Array.isArray(filesToValidate[extension])) { filesToValidate[extension] = [] }
    filesToValidate[extension].push(content.name)
  }
  return filesToValidate
}

const validateComponent = (path) => {
  assert.isString(path, `[validateComponent] argument must be a filepath of type string, found type: ${typeof path}`)
  if (!isComponent(path)) { throw new Error(`expected path to contain a ${componentIdentifier} file:\n${path}\n`) }
  const files = sortFileTypes(path)
  if ((!files.gql && !files.graphql) || (files.gql.length + files.graphql.length === 0)) {
    throw new Error(`no gql or graphql models found in path: ${path}`)
  }
}

const findComponents = (path) => {
  assert.isString(path, `[findComponents] argument must be a filepath of type string, found type: ${typeof path}`)
  let components = []
  const root = isComponent(path)
  if (root) {
    validateComponent(root)
    components.push(sortFileTypes(root))
  }
  const contents = sortFileTypes(path)
  if (contents.dirs && contents.dirs.length > 0) {
    for (const folder of contents.dirs) {
      const childPath = contents.path.endsWith('/') ? `${contents.path}${folder}` : `${contents.path}/${folder}`
      const childComponents = findComponents(childPath)
      components = [...components, ...childComponents]
    }
  }
  return components
}

module.exports.findComponents = findComponents
module.exports.isComponent = isComponent
module.exports.validateComponent = validateComponent
module.exports.sortFileTypes = sortFileTypes
