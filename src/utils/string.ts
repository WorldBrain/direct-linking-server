export function stripStringPrefix(s, prefix) {
  return s.startsWith(prefix) ? s.substr(0, prefix.length) : s
}