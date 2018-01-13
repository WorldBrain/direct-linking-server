const express = require('express')
const router = express.Router()
const url = require('url')
const path = require('path')
const https = require('https')
const querystring = require('query-string')
const proxy = require('http-proxy').createProxyServer({})

var db

router.get('/:linkid', (req, res, next) => {
  db.get(req.params.linkid, (err, linkdata) => {
    // link ID doesn't exist
    if (err) return handle404(err, res)

    // link ID exists
    // proxy to the target
    const opts = {
      target: linkdata.url,
      prependPath: true,
      ignorePath: true,
      changeOrigin: true,
      secure: false
    }

    const urlparts = url.parse(linkdata.url)


    if (urlparts.protocol === 'https') {
      opts.agent = http.globalAgent
      opts.headers = {
        host: urlparts.host
      }
    }

    proxy.web(req, res, opts, err => {
      if (err) console.error('PROXY ERROR', err)
    })
  })
})


module.exports = _db => {
  db = _db
  return router
}

function handle404 (err, res) {
  if (err) {
    console.error('Error getting data from db:', err)
  }
  const errfile = path.join(__dirname, '..', 'public', '404.html')
  res.status(404).sendFile(errfile, err => {
    if (err) {
      res.writeHead(500)
      res.end()
    }
  })
}

//
// Listen for the `error` event on `proxy`.
// proxy.on('error', function (err, req, res) {
//   res.writeHead(500, {
//     'Content-Type': 'text/plain'
//   });
//
//   res.end('Something went wrong. And we are reporting a custom error message.');
// });
//
// //
// // Listen for the `proxyRes` event on `proxy`.
// //
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  // console.log('RAW proxy request', proxyReq, options)
})

//
// Listen for the `proxyRes` event on `proxy`.
//
proxy.on('proxyRes', function (proxyRes, req, res) {
  // console.log('RAW Response from the target', proxyRes)
  const port = req.headers.host.split(':')[1] | null
  const location = url.format({
    protocol: req.protocol,
    hostname: req.hostname,
    port: port,
    pathname: req.originalUrl,
    search: querystring.stringify(req.query)
  })
  proxyRes.headers.location = location
});
