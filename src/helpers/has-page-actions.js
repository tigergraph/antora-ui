'use strict'

/**
 * Products that show the Copy page control.
 *
 * Savanna and Cloud Classic stay on this list; they render it through the
 * is-cloud-theme branch in article.hbs. To add a product, add its antora.yml
 * name here. Do NOT add it to is-cloud-theme.js (that turns on the whole cloud theme).
 *
 * Applies to every version of a listed component. The Markdown twin (.md) is
 * generated for all versions by doc-site/libs/markdown-for-llm.js.
 */
const COMPONENTS = [
  'savanna',
  'cloud',
  'home',
  'tigergraph-server',
  'gsql-ref',
  'gui',
  'insights',
  'graph-ml',
  'pytigergraph',
  'graphql',
  'ml-workbench',
]

module.exports = (page) => {
  const name = page && page.component && page.component.name
  return COMPONENTS.includes(name)
}
