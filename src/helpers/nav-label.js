'use strict'

/**
 * Wraps a leading HTTP verb in a nav label so API reference entries can show a
 * method badge. Labels without a verb are returned untouched.
 */
const METHOD_LABEL = /^(GET|POST|PUT|PATCH|DELETE)\s+(.+)$/

module.exports = (content) => {
  const text = content == null ? '' : String(content)
  const match = METHOD_LABEL.exec(text)
  if (!match) return text
  return '<span class="nav-method" data-method="' + match[1] + '">' + match[1] + '</span>' + match[2]
}
