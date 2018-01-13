const express = require('express')
const app = express()

const level = require('level')
const db = level('./db', { valueEncoding: 'json' }, run)

const path = require('path')

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

  app.listen(3000, () => console.log('Direct linking server running on port 3000'))
}

module.exports = db
