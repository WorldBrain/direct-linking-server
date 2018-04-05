import { stripStringPrefix } from "./string";

export function compareUrlsQuickAndDirty(left : string, right : string) {
  return _stripProtocol(left) === _stripProtocol(right)
}

export function _stripProtocol(url : string) {
  url = stripStringPrefix(url, 'http://')
  url = stripStringPrefix(url, 'https://')
  return url
}
