const path = require('path')
const fs = require('fs-extra')

const CONFIG_PATH = path.resolve(__dirname, '../config')
const INSTITUTIONS_PATH = path.resolve(CONFIG_PATH, './institutions.json')

const getInstitutions = () => {
  let institutions = {}

  if (fs.existsSync(INSTITUTIONS_PATH)) {
    const json = fs.readFileSync(INSTITUTIONS_PATH, 'utf8')
    if (json) {
      institutions = JSON.parse(json)
    }
  }

  return institutions
}

const storeInstitions = (institutions = {}) => {
  fs.writeFileSync(INSTITUTIONS_PATH, JSON.stringify(institutions, null, 2))
}

const updateInstitution = (key, value) => {
  const institutions = getInstitutions()
  institutions[key] = {
    ...institutions[key],
    ...value
  }

  storeInstitions(institutions)
}

module.exports = {
  getInstitutions,
  updateInstitution
}