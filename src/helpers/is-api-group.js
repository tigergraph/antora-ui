'use strict'

/**
 * True for a nav group whose children are all API endpoints (their labels start
 * with an HTTP verb). Those groups are section titles, not collapsible items.
 * Only the cloud theme styles them that way, so other components are excluded
 * rather than left to depend on their nav labels not reading like endpoints.
 */
const METHOD_LABEL = /^(GET|POST|PUT|PATCH|DELETE)\s/

// inlined rather than required from is-cloud-theme: Antora registers each
// helper file on its own, with no module resolution between them
function isCloudTheme (page) {
  const name = page && page.component && page.component.name
  return name === 'savanna' || name === 'cloud'
}

module.exports = (item, page) => {
  if (!isCloudTheme(page)) return false
  if (!item || item.url || !Array.isArray(item.items) || !item.items.length) return false
  return item.items.every((child) => METHOD_LABEL.test(String(child.content || '').replace(/<[^>]+>/g, '')))
}
