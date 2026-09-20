'use strict'

/**
 * Splits Savanna's navigation into tabs. The REST API module becomes
 * API reference, release notes become Changelog, everything else is Platform.
 * Components without both Platform and API keep a single, untabbed nav.
 */
const API_MODULE = 'rest-api'

function firstInternalUrl (item) {
  if (!item) return
  if (item.url && item.urlType !== 'external') return item.url
  for (const child of item.items || []) {
    const url = firstInternalUrl(child)
    if (url) return url
  }
}

function inApiModule (url) {
  return !!url && url.includes('/' + API_MODULE + '/')
}

function isChangelog (url) {
  return !!url && /(^|\/)release-notes(\.html)?([/?#]|$)/.test(url)
}

function isChangelogGroup (item) {
  if (!item) return false
  if (isChangelog(firstInternalUrl(item))) return true
  const label = String(item.content || '').replace(/<[^>]+>/g, '')
  return /release notes/i.test(label)
}

// Each antora.yml nav entry is wrapped as { items, root, order } with no
// content of its own. Unwrap so siblings in one nav file can land on
// different tabs (Introduction vs Release Notes).
function unwrapNavFiles (navigation) {
  const out = []
  for (const group of navigation || []) {
    if (group && group.root && !group.content && !group.url && Array.isArray(group.items)) {
      out.push(...group.items)
    } else if (group) {
      out.push(group)
    }
  }
  return out
}

function promoteLoneGroup (groups) {
  const only = groups.length === 1 ? groups[0] : undefined
  if (only && !only.url && Array.isArray(only.items) && only.items.length) return only.items
  return groups
}

module.exports = (page) => {
  const navigation = unwrapNavFiles((page && page.navigation) || [])
  // Unwrapping drops a nesting level, so nav-tree starts one level deeper to
  // keep the indentation the wrapped navigation produced.
  const untabbed = { enabled: false, tabs: [], groups: (page && page.navigation) || [], level: 0 }
  if (!page || !page.component || page.component.name !== 'savanna') return untabbed
  const docs = []
  const api = []
  const changelog = []
  navigation.forEach((group) => {
    const url = firstInternalUrl(group)
    if (inApiModule(url)) api.push(group)
    else if (isChangelogGroup(group)) changelog.push(group)
    else docs.push(group)
  })
  if (!docs.length || !api.length) return untabbed
  const onApi = page.module === API_MODULE || inApiModule(page.url)
  const onChangelog = isChangelog(page.url)
  const changelogUrl = firstInternalUrl(changelog[0])
  const platformUrl = firstInternalUrl(docs[0]) || (page.componentVersion && page.componentVersion.url)
  const apiUrl = firstInternalUrl(api[0])
  if (!platformUrl || !apiUrl) return untabbed
  const tabs = [
    { title: 'Platform', url: platformUrl, active: !onApi && !onChangelog },
    { title: 'API reference', url: apiUrl, active: onApi },
  ]
  if (changelogUrl) tabs.push({ title: 'Changelog', url: changelogUrl, active: onChangelog })
  return {
    enabled: true,
    tabs,
    // A tab holding a single titled group repeats its own label, so show the
    // group's children instead of the group.
    groups: promoteLoneGroup(onApi ? api : onChangelog ? changelog : docs),
    level: 1,
  }
}
