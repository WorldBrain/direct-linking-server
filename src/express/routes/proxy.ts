import { createProxyServer } from 'http-proxy'

export function proxyGetRequest({}) {
  const proxyServer = createProxyServer({})
  return function handleProxyGetRequest({req, res}) {
    
  }
}
