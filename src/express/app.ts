const express = require('express')
const bodyParser = require('body-parser')
import { AppRoutes } from './routes'
import { retrieveAnnotation } from './routes/annotation';

export default function createApp(
  {routes, allowUndefinedRoutes = false} :
  {routes : AppRoutes, allowUndefinedRoutes? : boolean}
) {
  function route(f?) {
    if (!f && allowUndefinedRoutes) {
      f = () => {}
    }
    return f
  }

  const app = express()
  app.use(bodyParser.json())
  app.get('/__/:url', route(routes.proxy))
  app.get('/:annotation-id/:url', route(routes.retrieveAnnotation))
  app.post('/', route(routes.retrieveAnnotation))
  return app
}
