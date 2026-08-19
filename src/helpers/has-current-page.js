'use strict'

const containsUrl = (items, url) =>
  items.some((item) => item.url === url || (item.items ? containsUrl(item.items, url) : false))

module.exports = (items, url) => (items && url ? containsUrl(items, url) : false)
