const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const { addFirebaseRoutes } = require('./firebase')
const addPlaidRoutes = require('./plaid')
const app = express()

const PORT = process.env.PORT || 4000

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// addFirebaseRoutes(app)
addPlaidRoutes(app)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
})

app.listen(PORT)