'use strict'

/**
 * Map an Antora HTML page URL to its LLM Markdown twin.
 * Example: /savanna/main/overview/index.html → /savanna/main/overview/index.md
 */
module.exports = (url) => (typeof url === 'string' ? url.replace(/\.html(?=[#?]|$)/, '.md') : url)
