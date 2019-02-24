const firebase = require('firebase/app')
require('firebase/database')
const { config, namespace } = require('./config')

firebase.initializeApp(config)
const db = firebase.database().ref(namespace)

const routeFns = {
  get: (key) => {
    return async () => {
      const snapshot = await db.child(key).once('value')
      const value = snapshot.val()
      return value
    }
  },

  post: (key) => {
    return async (data) => {
      await db.child(key).set(data)
      return true
    }
  },

  put: (key) => {
    return async (data) => {
      await db.child(key).update(data)
      return true
    }
  },
}

const routes = [
  'institutions',
  'institutions/:id',
  'transaction-rules',
  'transaction-rules/:id'
]

const postNew = (key) => {
  return async (data) => {
    const newRef = db.child(key).push()
    await newRef.set({
      ...data,
      key: newRef.key,
    })
    return newRef.key
  }
}

module.exports = {
  routeFns,
  routes,
  postNew
}