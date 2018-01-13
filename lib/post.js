const shorthash = require('shorthash')

module.exports = db => (req, res, next) => {
  const url = req.body.url
  const selector = req.body.selector
  const linkid = shorthash.unique(`${url}#${selector}`)

  db.put(linkid, req.body, err => {
    if (err) return next(err)

    res.send({
      linkid: linkid,
      success: !err
    })
  })
}
