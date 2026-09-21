'use strict'

/**
 * Wraps a leading HTTP verb in a nav label so API reference entries can show a
 * method badge. Labels without a verb are returned untouched, as are all labels
 * outside the cloud theme, which is the only theme that styles the badge.
 */
const METHOD_LABEL = /^(GET|POST|PUT|PATCH|DELETE)\s+(.+)$/

// inlined rather than required from is-cloud-theme: Antora registers each
// helper file on its own, with no module resolution between them
function isCloudTheme (page) {
  const name = page && page.component && page.component.name
  return name === 'savanna' || name === 'cloud'
}

module.exports = (content, page) => {
  const text = content == null ? '' : String(content)
  if (!isCloudTheme(page)) return text
  const match = METHOD_LABEL.exec(text)
  if (!match) return text
  // the label is its own box so a long name wraps under itself, not the badge
  return (
    '<span class="nav-method" data-method="' + match[1] + '">' + match[1] + '</span>' +
    '<span class="nav-endpoint">' + match[2] + '</span>'
  )
}
