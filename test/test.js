var test = require('tape')
var got = require('got')

var db = require('../lib/app')

var server = process.env.SERVER || 'http://localhost:3000'

setTimeout(dotest, 1000)

function dotest () {
  test('post one get one', function (t) {
    got(server, {
      json: true,
      body: {
        url: 'https://worldbrain.io/team',
        title: 'test article',
        selector: 'annotationselector',
        quote: 'this is the full text of the selection'
      }
    }).then(
      (res, err) => {
        if (err) throw err
        console.log(res.body)
        return got(`${server}/${res.body.linkid}`)
      }
    ).then(
      (res, err) => {
        if (err) throw err
        console.log('GOT BODY')
      }
    ).catch(
      err => console.error(err)
    )
  })
}
