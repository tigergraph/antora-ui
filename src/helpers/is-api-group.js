'use strict'

/**
 * True for a nav group whose children are all API endpoints (their labels start
 * with an HTTP verb). Those groups are section titles, not collapsible items.
 */
const METHOD_LABEL = /^(GET|POST|PUT|PATCH|DELETE)\s/

module.exports = (item) => {
  if (!item || item.url || !Array.isArray(item.items) || !item.items.length) return false
  return item.items.every((child) => METHOD_LABEL.test(String(child.content || '').replace(/<[^>]+>/g, '')))
}
