;(function () {
  'use strict'

  var SECT_CLASS_RX = /^sect(\d)$/

  var navContainer = document.querySelector('.nav-container')
  var navToggle = document.querySelector('.nav-toggle')

  navToggle.addEventListener('click', showNav)
  navContainer.addEventListener('click', trapEvent)

  var menuPanel = navContainer.querySelector('[data-panel=menu]')
  if (!menuPanel) return
  var nav = navContainer.querySelector('.nav')

  var currentPageItem = menuPanel.querySelector('.is-current-page')
  var originalPageItem = currentPageItem
  if (currentPageItem) activateCurrentPath(currentPageItem)
  restoreMenuScroll()
  sizeEndpointLabels()
  revealCurrentPageItem()
  // the fallback face measures differently, so redo both once the webfont lands,
  // unless the reader has meanwhile scrolled the menu somewhere of their own
  if (document.fonts && document.fonts.ready) {
    var settledScroll = menuPanel.scrollTop
    document.fonts.ready.then(function () {
      sizeEndpointLabels()
      if (menuPanel.scrollTop === settledScroll) revealCurrentPageItem()
    })
  }

  find(menuPanel, '.nav-item-toggle').forEach(function (btn) {
    // closest() resolves the nav-item whether or not the theme-cloud .nav-row
    // wrapper sits between the toggle and its nav-item (identical result for
    // the default UI, where the toggle is a direct child of the nav-item).
    var li = btn.closest('.nav-item')
    btn.addEventListener('click', toggleActive.bind(li))
    var navItemSpan = findPreviousElement(btn, '.nav-text')
    if (navItemSpan) {
      navItemSpan.style.cursor = 'pointer'
      navItemSpan.addEventListener('click', toggleActive.bind(li))
    }
  })

  // NOTE prevent text from being selected by double click
  menuPanel.addEventListener('mousedown', function (e) {
    if (e.detail > 1) e.preventDefault()
  })

  function onHashChange () {
    var navLink
    var hash = window.location.hash
    if (hash) {
      if (hash.indexOf('%')) hash = decodeURIComponent(hash)
      navLink = menuPanel.querySelector('.nav-link[href="' + hash + '"]')
      if (!navLink) {
        var targetNode = document.getElementById(hash.slice(1))
        if (targetNode) {
          var current = targetNode
          var ceiling = document.querySelector('article.doc')
          while ((current = current.parentNode) && current !== ceiling) {
            var id = current.id
            // NOTE: look for section heading
            if (!id && (id = SECT_CLASS_RX.test(current.className))) id = (current.firstElementChild || {}).id
            if (id && (navLink = menuPanel.querySelector('.nav-link[href="#' + id + '"]'))) break
          }
        }
      }
    }
    var navItem
    if (navLink) {
      navItem = navLink.closest('.nav-item')
    } else if (originalPageItem) {
      navLink = (navItem = originalPageItem).querySelector('.nav-link')
    } else {
      return
    }
    if (navItem === currentPageItem) return
    find(menuPanel, '.nav-item.is-active').forEach(function (el) {
      el.classList.remove('is-active', 'is-current-path', 'is-current-page')
    })
    navItem.classList.add('is-current-page')
    currentPageItem = navItem
    activateCurrentPath(navItem)
  }

  if (menuPanel.querySelector('.nav-link[href^="#"]')) {
    if (window.location.hash) onHashChange()
    window.addEventListener('hashchange', onHashChange)
  }

  function activateCurrentPath (navItem) {
    var ancestorClasses
    var ancestor = navItem.parentNode
    while (!(ancestorClasses = ancestor.classList).contains('nav-menu')) {
      if (ancestor.tagName === 'LI' && ancestorClasses.contains('nav-item')) {
        ancestorClasses.add('is-active', 'is-current-path')
      }
      ancestor = ancestor.parentNode
    }
    navItem.classList.add('is-active')
  }

  function toggleActive () {
    if (this.classList.toggle('is-active')) {
      var padding = parseFloat(window.getComputedStyle(this).marginTop)
      var rect = this.getBoundingClientRect()
      var menuPanelRect = menuPanel.getBoundingClientRect()
      var overflowY = (rect.bottom - menuPanelRect.top - menuPanelRect.height + padding).toFixed()
      if (overflowY > 0) menuPanel.scrollTop += Math.min((rect.top - menuPanelRect.top - padding).toFixed(), overflowY)
    }
  }

  function showNav (e) {
    if (navToggle.classList.contains('is-active')) return hideNav(e)
    trapEvent(e)
    var html = document.documentElement
    html.classList.add('is-clipped--nav')
    navToggle.classList.add('is-active')
    navContainer.classList.add('is-active')
    var bounds = nav.getBoundingClientRect()
    var expectedHeight = window.innerHeight - Math.round(bounds.top)
    if (Math.round(bounds.height) !== expectedHeight) nav.style.height = expectedHeight + 'px'
    html.addEventListener('click', hideNav)
  }

  function hideNav (e) {
    trapEvent(e)
    var html = document.documentElement
    html.classList.remove('is-clipped--nav')
    navToggle.classList.remove('is-active')
    navContainer.classList.remove('is-active')
    html.removeEventListener('click', hideNav)
  }

  function trapEvent (e) {
    e.stopPropagation()
  }

  // The menu never scrolls itself to the current page; it simply carries its
  // position across page loads so following a link leaves it visually still.
  // The key is the first link's absolute URL, which identifies the menu, so a
  // different component or tab starts at the top instead of a stale offset.
  function menuScrollKey () {
    var firstLink = menuPanel.querySelector('.nav-link')
    return firstLink ? 'nav-scroll:' + firstLink.href : null
  }

  function restoreMenuScroll () {
    var key = menuScrollKey()
    if (key) {
      try {
        var saved = window.sessionStorage.getItem(key)
        if (saved) menuPanel.scrollTop = parseFloat(saved)
      } catch (e) {}
    }
    // pagehide also covers the back/forward cache, where unload never fires
    window.addEventListener('pagehide', function () {
      if (!key) return
      try {
        window.sessionStorage.setItem(key, menuPanel.scrollTop)
      } catch (e) {}
    })
  }

  // A link in the body of a page can land on an entry that the carried-over scroll
  // position leaves off screen, so the menu looks like nothing is selected. Only
  // that case scrolls, and only far enough to bring the entry inside the panel:
  // an entry clicked in the menu is on screen already, so the menu stays put.
  function revealCurrentPageItem () {
    if (!currentPageItem) return
    // the entry's own row, so a group with many children is not measured whole
    var row = currentPageItem.querySelector('.nav-row, .nav-link') || currentPageItem
    var rect = row.getBoundingClientRect()
    var panel = menuPanel.getBoundingClientRect()
    var margin = 24 // clear of the edge, where the entry reads as cut off
    if (rect.top < panel.top + margin) {
      menuPanel.scrollTop -= panel.top + margin - rect.top
    } else if (rect.bottom > panel.bottom - margin) {
      menuPanel.scrollTop += rect.bottom - panel.bottom + margin
    }
  }

  // Becoming the current page bolds an API endpoint label, and bold sets wider,
  // so a label that just fits on one line can reflow onto two. How much wider
  // depends on the string (1-3% in Inter), which no single CSS fudge covers, so
  // every label is measured in both weights and publishes its own ratio. The
  // stylesheet lays the label out in the width its bold self needs, keeping the
  // line breaks identical whether or not it is current.
  function sizeEndpointLabels () {
    var labels = find(menuPanel, '.nav-endpoint')
    if (!labels.length) return
    var canvas = document.createElement('canvas')
    if (!canvas.getContext) return
    var ruler = canvas.getContext('2d')
    var measure = function (weight, font, text) {
      ruler.font = weight + ' ' + font
      return ruler.measureText(text).width
    }
    labels.forEach(function (label) {
      var style = window.getComputedStyle(label)
      var font = style.fontSize + ' ' + style.fontFamily
      var bold = style.getPropertyValue('--body-font-weight-bold').trim() || '600'
      var text = label.textContent
      var plain = measure('400', font, text)
      if (!plain) return
      label.style.setProperty('--bold-ratio', (measure(bold, font, text) / plain).toFixed(4))
    })
  }

  function find (from, selector) {
    return [].slice.call(from.querySelectorAll(selector))
  }

  function findPreviousElement (from, selector) {
    var el = from.previousElementSibling
    return el && selector ? el[el.matches ? 'matches' : 'msMatchesSelector'](selector) && el : el
  }
})()
