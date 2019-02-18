const { routes, routeFns } = require('./routes')
const multer = require('multer')
const upload = multer()

const generateDynamicRoute = (route, req) => {
  const parts = route.split('/')
  const modifiedParts = []

  parts.forEach(part => {
    const colonSplit = part.split(':')

    if (!colonSplit[1]) {
      modifiedParts.push(part)
      return
    }

    modifiedParts.push(req.params[colonSplit[1]])
  })

  return modifiedParts.join('/')
}

const addFirebaseRoutes = (app) => {
  routes.forEach(route => {
    const types = Object.keys(routeFns)
    const parts = route.split('/')

    types.forEach(type => {
      app[type](`/firebase/${route}`, upload.array(), async (req, res) => {
        const modifiedRoute = generateDynamicRoute(route, req)
        const routeFn = routeFns[type](modifiedRoute)
        const value = await routeFn(req.body)

        res.json(value)
      })
    })
  })
}

module.exports = {
  addFirebaseRoutes
}
