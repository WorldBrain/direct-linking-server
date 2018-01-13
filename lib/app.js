const express = require('express')
const app = express()

const level = require('level')
const db = level('./db', { valueEncoding: 'json' }, run)

const http = require('http')
const https = require('https')

const path = require('path')
const fs = require('fs')

const sslopts = {
  key: fs.readFileSync('~/.certs/default.key'),
  cert: fs.readFileSync('~/.certs/default.crt')
}

function run (err) {
  if (err) throw err

  app.use(express.static(path.join(__dirname, '..', 'public')))

  // don't parse query strings so they are preserved as strings in redirect
  app.set('query parser', false)

  // load templating for redirect loading page
  app.set('view engine', 'mustache')

  app.get('/', (req, res) => res.sendFile('index.html'))
  app.get('/*', require('./resolve')(db))
  app.post('/', express.json(), require('./post')(db))

  app.use(require('./404'))

  http.createServer(app).listen(80)
  https.createServer(sslopts, app).listen(443)
}

module.exports = db
