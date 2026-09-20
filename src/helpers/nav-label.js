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
  // the label is its own box so a long name wraps under itself, not the badge
  return (
    '<span class="nav-method" data-method="' + match[1] + '">' + match[1] + '</span>' +
    '<span class="nav-endpoint">' + match[2] + '</span>'
  )
}
