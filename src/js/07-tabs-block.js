;(function () { /*! Asciidoctor Tabs | Copyright (c) 2018-present Dan Allen | MIT License */
  'use strict'

  var config = (document.currentScript || {}).dataset || {}
  var forEach = Array.prototype.forEach

  // The @asciidoctor/tabs markup and underline treatment are enabled only for
  // Savanna and Cloud Classic. Other products retain the legacy tab behavior.
  if (document.documentElement.classList.contains('theme-cloud')) {
    init([].filter.call(document.querySelectorAll('.tabs'), function (el) {
      return el.querySelector('.tablist')
    }))
  }
  initLegacyTabsets(document.querySelectorAll('.tabset'))

  function init (tabsBlocks) {
    if (!tabsBlocks.length) return
    forEach.call(tabsBlocks, function (tabs) {
      var syncIds = tabs.classList.contains('is-sync') ? {} : undefined
      var tablist = tabs.querySelector('.tablist ul')
      tablist.setAttribute('role', 'tablist')
      var start
      forEach.call(tablist.querySelectorAll('li'), function (tab, idx) {
        tab.tabIndex = -1
        tab.setAttribute('role', tab.classList.add('tab') || 'tab')
        var id, anchor, syncId
        if (!(id = tab.id) && (anchor = tab.querySelector('a[id]'))) {
          id = tab.id = anchor.parentNode.removeChild(anchor).id
        }
        var panel = id && tabs.querySelector('.tabpanel[aria-labelledby~="' + id + '"]')
        if (!panel) return idx ? undefined : toggleSelected(tab, true) // invalid state
        syncIds && (((syncId = tab.textContent.trim()) in syncIds) ? (syncId = undefined) : true) &&
          (syncIds[(tab.dataset.syncId = syncId)] = tab)
        idx || (syncIds && (start = { tab: tab, panel: panel })) ? toggleHidden(panel, true) : toggleSelected(tab, true)
        tab.setAttribute('aria-controls', panel.id)
        panel.setAttribute('role', 'tabpanel')
        var onClick = syncId === undefined ? activateTab : activateTabSync
        tab.addEventListener('click', onClick.bind({ tabs: tabs, tab: tab, panel: panel }))
      })
      if (!tabs.closest('.tabpanel')) {
        forEach.call(tabs.querySelectorAll('.tabpanel table.tableblock'), function (table) {
          var container = Object.assign(document.createElement('div'), { className: 'tablecontainer' })
          table.parentNode.insertBefore(container, table).appendChild(table)
        })
      }
      if (start) {
        var syncGroupId
        for (var i = 0, lst = tabs.classList, len = lst.length, className; i !== len; i++) {
          if (!(className = lst.item(i)).startsWith('data-sync-group-id=')) continue
          tabs.dataset.syncGroupId = syncGroupId = lst.remove(className) || className.slice(19).replace(/\u00a0/g, ' ')
          break
        }
        if (syncGroupId === undefined) tabs.dataset.syncGroupId = syncGroupId = Object.keys(syncIds).sort().join('|')
        var preferredSyncId = 'syncStorageKey' in config &&
          window[(config.syncStorageScope || 'local') + 'Storage'].getItem(config.syncStorageKey + '-' + syncGroupId)
        var tab = preferredSyncId && syncIds[preferredSyncId]
        tab && Object.assign(start, { tab: tab, panel: document.getElementById(tab.getAttribute('aria-controls')) })
        toggleSelected(start.tab, true) || toggleHidden(start.panel, false)
      }
    })
    onHashChange()
    toggleClassOnEach(tabsBlocks, 'is-loading', 'remove')
    window.setTimeout(toggleClassOnEach.bind(null, tabsBlocks, 'is-loaded', 'add'), 0)
    window.addEventListener('hashchange', onHashChange)
  }

  function activateTab (e) {
    var tab = this.tab
    var tabs = this.tabs || (this.tabs = tab.closest('.tabs'))
    var panel = this.panel || (this.panel = document.getElementById(tab.getAttribute('aria-controls')))
    querySelectorWithSiblings(tabs, '.tablist .tab', 'tab').forEach(function (el) {
      toggleSelected(el, el === tab)
    })
    querySelectorWithSiblings(tabs, '.tabpanel', 'tabpanel').forEach(function (el) {
      toggleHidden(el, el !== panel)
    })
    if (!this.isSync && 'syncStorageKey' in config && 'syncGroupId' in tabs.dataset) {
      var storageKey = config.syncStorageKey + '-' + tabs.dataset.syncGroupId
      window[(config.syncStorageScope || 'local') + 'Storage'].setItem(storageKey, tab.dataset.syncId)
    }
    if (!e) return
    var loc = window.location
    var hashIdx = loc.hash ? loc.href.indexOf('#') : -1
    if (~hashIdx) window.history.replaceState(null, '', loc.href.slice(0, hashIdx))
    e.preventDefault()
  }

  function activateTabSync (e) {
    activateTab.call(this, e)
    var thisTabs = this.tabs
    var thisTab = this.tab
    var initialY = thisTabs.getBoundingClientRect().y
    forEach.call(document.querySelectorAll('.tabs'), function (tabs) {
      if (tabs === thisTabs || tabs.dataset.syncGroupId !== thisTabs.dataset.syncGroupId) return
      querySelectorWithSiblings(tabs, '.tablist .tab', 'tab').forEach(function (tab) {
        if (tab.dataset.syncId === thisTab.dataset.syncId) activateTab.call({ tabs: tabs, tab: tab, isSync: true })
      })
    })
    var shiftedBy = thisTabs.getBoundingClientRect().y - initialY
    if (shiftedBy && (shiftedBy = Math.round(shiftedBy))) window.scrollBy({ top: shiftedBy, behavior: 'instant' })
  }

  function querySelectorWithSiblings (scope, selector, siblingClass) {
    var el = scope.querySelector(selector)
    if (!el) return []
    var result = [el]
    while ((el = el.nextElementSibling) && el.classList.contains(siblingClass)) result.push(el)
    return result
  }

  function toggleClassOnEach (elements, className, method) {
    forEach.call(elements, function (el) {
      el.classList[method](className)
    })
  }

  function toggleHidden (el, state) {
    el.classList[(el.hidden = state) ? 'add' : 'remove']('is-hidden')
  }

  function toggleSelected (el, state) {
    el.setAttribute('aria-selected', '' + state)
    el.classList[state ? 'add' : 'remove']('is-selected')
    el.tabIndex = state ? 0 : -1
  }

  function onHashChange () {
    var id = window.location.hash.slice(1)
    if (!id) return
    var tab = document.getElementById(~id.indexOf('%') ? decodeURIComponent(id) : id)
    if (!(tab && tab.classList.contains('tab'))) return
    'syncId' in tab.dataset ? activateTabSync.call({ tab: tab }) : activateTab.call({ tab: tab })
  }

  // Legacy .tabset markup used by other TigerGraph products that share this
  // UI bundle. Ported from the original tabs script so those tabs keep working.
  function initLegacyTabsets (tabsets) {
    if (!tabsets.length) return
    var hash = window.location.hash
    forEach.call(tabsets, function (tabset) {
      var active
      var tabs = tabset.querySelector('.tabs')
      if (tabs) {
        var first
        forEach.call(tabs.querySelectorAll('li'), function (tab, idx) {
          var id = (tab.querySelector('a[id]') || tab).id
          if (!id) return
          var pane = getLegacyPane(id, tabset)
          if (!idx) first = { tab: tab, pane: pane }
          if (!active && hash === '#' + id && (active = true)) {
            tab.classList.add('is-active')
            if (pane) pane.classList.add('is-active')
          } else if (!idx) {
            tab.classList.remove('is-active')
            if (pane) pane.classList.remove('is-active')
          }
          tab.addEventListener('click', activateLegacyTab.bind({ tabset: tabset, tab: tab, pane: pane }))
        })
        if (!active && first) {
          first.tab.classList.add('is-active')
          if (first.pane) first.pane.classList.add('is-active')
        }
      }
      tabset.classList.remove('is-loading')
    })
  }

  function activateLegacyTab (e) {
    var tab = this.tab
    var pane = this.pane
    forEach.call(this.tabset.querySelectorAll('.tabs li, .tab-pane'), function (it) {
      it === tab || it === pane ? it.classList.add('is-active') : it.classList.remove('is-active')
    })
    e.preventDefault()
  }

  function getLegacyPane (id, tabset) {
    return [].find.call(tabset.querySelectorAll('.tab-pane'), function (it) {
      return it.getAttribute('aria-labelledby') === id
    })
  }
})()
