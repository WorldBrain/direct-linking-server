import * as request from 'supertest'
import createApp from './app'
import { expect } from 'chai';

describe('Express app', () => {
  let app
  let log = {
    called: false,
    req: null,
    res: null,
  }

  async function initApp(routes) {
    app = createApp({routes, allowUndefinedRoutes: true})
    // app.listen(3000,)
    return app
  }

  // afterEach(async () => {
  //   await new Promise((resolve, reject) => {
  //     app.close(err => err ? reject(err) : resolve())
  //   })
  // })

  function createLoggerRoute() {
    log = {
      called: false,
      req: null,
      res: null,
    }
    return (req, res) => {
      log.called = true
      log.req = req
      log.res = res
    }
  }

  it('should route proxy requests correctly', async () => {
    const app = await initApp({proxy: createLoggerRoute()})
    await request(app)
      .get('/__/test')
    expect(log.called).to.be.true
    expect(log.req.params.url).to.equal('test/one/two')
  })
})
