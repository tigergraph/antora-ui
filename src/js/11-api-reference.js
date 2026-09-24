;(function () {
  'use strict'

  var root = document.querySelector('[data-api-reference]')
  if (!root) return

  function find (from, selector) {
    return [].slice.call(from.querySelectorAll(selector))
  }

  function visiblePaneText (kind) {
    var selector = kind === 'request' ? '[data-request-language]' : '[data-response-pane]'
    var pane = find(root, selector).find(function (candidate) {
      return !candidate.hidden
    })
    return pane ? pane.textContent : ''
  }

  function writeClipboardFallback (text) {
    return new Promise(function (resolve, reject) {
      var input = document.createElement('textarea')
      input.value = text
      input.setAttribute('readonly', '')
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      try {
        if (!document.execCommand('copy')) throw new Error('copy command failed')
        resolve()
      } catch (err) {
        reject(err)
      } finally {
        document.body.removeChild(input)
      }
    })
  }

  function writeClipboard (text) {
    if (window.navigator.clipboard && window.navigator.clipboard.writeText) {
      return window.navigator.clipboard.writeText(text).catch(function () {
        return writeClipboardFallback(text)
      })
    }
    return writeClipboardFallback(text)
  }

  function setCopyState (button, state) {
    var status = button.querySelector('.api-copy-status')
    window.clearTimeout(button.apiCopyTimer)
    button.classList.toggle('is-copied', state === 'copied')
    button.classList.toggle('is-copy-error', state === 'error')
    if (status) status.textContent = state === 'copied' ? 'Copied' : state === 'error' ? 'Copy failed' : ''
    if (state === 'copied' || state === 'error') {
      button.apiCopyTimer = window.setTimeout(function () {
        setCopyState(button, '')
      }, 1600)
    }
  }

  find(root, '.api-copy').forEach(function (button) {
    button.addEventListener('click', function () {
      var targetId = button.getAttribute('data-copy-target')
      var activeKind = button.getAttribute('data-copy-active-pane')
      var target = targetId && document.getElementById(targetId)
      var text = activeKind ? visiblePaneText(activeKind) : target ? target.textContent : ''
      if (!text) return
      writeClipboard(text.trim()).then(
        function () {
          setCopyState(button, 'copied')
        },
        function () {
          setCopyState(button, 'error')
        }
      )
    })
  })

  // The language picker and the response status picker are the same widget
  // over different values, and the status one only exists when an endpoint
  // documents more than one response.
  function createMenu (picker, options) {
    if (!picker) return null
    var toggle = picker.querySelector(options.toggle)
    var menu = picker.querySelector(options.menu)
    var items = menu ? find(menu, '[' + options.value + ']') : []
    if (!toggle || !menu || !items.length) return null

    function close (restoreFocus) {
      menu.hidden = true
      toggle.setAttribute('aria-expanded', 'false')
      if (restoreFocus) toggle.focus()
    }

    function open () {
      menu.hidden = false
      toggle.setAttribute('aria-expanded', 'true')
      var checked = items.find(function (item) {
        return item.getAttribute('aria-checked') === 'true'
      })
      ;(checked || items[0]).focus()
    }

    toggle.addEventListener('click', function (event) {
      event.stopPropagation()
      if (menu.hidden) open()
      else close(false)
    })
    toggle.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        open()
      } else if (event.key === 'Escape') {
        close(false)
      }
    })
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        options.select(item.getAttribute(options.value), true)
      })
    })
    menu.addEventListener('click', function (event) {
      event.stopPropagation()
    })
    menu.addEventListener('keydown', function (event) {
      var current = items.indexOf(document.activeElement)
      var next
      if (event.key === 'ArrowDown') next = (current + 1) % items.length
      else if (event.key === 'ArrowUp') next = (current - 1 + items.length) % items.length
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = items.length - 1
      else if (event.key === 'Escape') {
        event.preventDefault()
        close(true)
        return
      } else {
        return
      }
      event.preventDefault()
      items[next].focus()
    })
    document.documentElement.addEventListener('click', function () {
      close(false)
    })

    return { items: items, close: close }
  }

  function showOnly (attribute, value) {
    find(root, '[' + attribute + ']').forEach(function (pane) {
      pane.hidden = pane.getAttribute(attribute) !== value
    })
  }

  var languagePicker = createMenu(root.querySelector('.api-language-picker'), {
    toggle: '.api-language-toggle',
    menu: '.api-language-menu',
    value: 'data-language',
    select: function (language, restoreFocus) {
      selectLanguage(language, restoreFocus)
    },
  })
  var languageLabel = root.querySelector('[data-language-label]')
  var languageIcon = root.querySelector('.api-language-toggle .api-language-icon')

  function selectLanguage (language, restoreFocus) {
    if (!languagePicker) return
    var selected
    languagePicker.items.forEach(function (item) {
      var active = item.getAttribute('data-language') === language
      item.setAttribute('aria-checked', active ? 'true' : 'false')
      if (active) selected = item
    })
    if (!selected) return
    showOnly('data-request-language', language)
    languageLabel.textContent = selected.textContent
    if (languageIcon) languageIcon.setAttribute('data-language-icon', language)
    try {
      window.sessionStorage.setItem('savanna-api-language', language)
    } catch (e) {}
    languagePicker.close(restoreFocus)
  }

  if (languagePicker) {
    var savedLanguage
    try {
      savedLanguage = window.sessionStorage.getItem('savanna-api-language')
    } catch (e) {}
    if (savedLanguage) selectLanguage(savedLanguage, false)
  }

  var responseTabs = find(root, '.api-response-tabs [data-response-status]')
  var statusPicker = createMenu(root.querySelector('.api-status-picker'), {
    toggle: '.api-status-toggle',
    menu: '.api-status-menu',
    value: 'data-response-status',
    select: function (status, restoreFocus) {
      selectResponse(status, false)
      statusPicker.close(restoreFocus)
    },
  })
  var statusLabel = root.querySelector('[data-status-label]')

  // The documented schema and the example belong to the same status, so the
  // heading menu and the example tabs move together.
  function selectResponse (status, focusTab) {
    responseTabs.forEach(function (tab) {
      var active = tab.getAttribute('data-response-status') === status
      tab.setAttribute('aria-selected', active ? 'true' : 'false')
      tab.setAttribute('tabindex', active ? '0' : '-1')
      if (active && focusTab) tab.focus()
    })
    if (statusPicker) {
      statusPicker.items.forEach(function (item) {
        item.setAttribute('aria-checked', item.getAttribute('data-response-status') === status ? 'true' : 'false')
      })
      if (statusLabel) statusLabel.textContent = status
    }
    showOnly('data-response-pane', status)
    showOnly('data-response-schema', status)
  }

  responseTabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      selectResponse(tab.getAttribute('data-response-status'), false)
    })
    tab.addEventListener('keydown', function (event) {
      var next
      if (event.key === 'ArrowRight') next = (index + 1) % responseTabs.length
      else if (event.key === 'ArrowLeft') next = (index - 1 + responseTabs.length) % responseTabs.length
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = responseTabs.length - 1
      else return
      event.preventDefault()
      selectResponse(responseTabs[next].getAttribute('data-response-status'), true)
    })
  })

  find(root, '.api-schema-details').forEach(function (details) {
    var summary = details.querySelector('summary')
    if (!summary) return
    function syncExpanded () {
      summary.setAttribute('aria-expanded', details.open ? 'true' : 'false')
    }
    details.addEventListener('toggle', syncExpanded)
    syncExpanded()
  })

  // The bundled highlight.js tags little beyond strings and keywords, so most
  // request panes would arrive almost uncoloured — Java gets nothing at all.
  // Tag the remaining roles here to match the reference palette. Only text
  // nodes that are direct children of the block are walked, which leaves
  // anything the highlighter already claimed untouched.
  var SHELL_TOKENS = /(^|\s)(curl)\b|(--?[a-zA-Z][\w-]*)/g
  var CODE_TOKENS = new RegExp(
    [
      '\\.([A-Za-z_$][\\w$]*)(?=\\s*\\()', // method call
      '\\b([A-Z][A-Z0-9_]{2,})\\b', // screaming-case constant
      '\\b([A-Za-z_$][\\w$]*)(?=\\s*\\()', // bare call
      ':=|=>|->|[=!<>]=|=', // assignment and arrow operators
    ].join('|'),
    'g'
  )

  function shellToken (match) {
    var text = match[2] || match[3]
    return { text: text, className: match[2] ? 'api-command' : 'api-flag' }
  }

  // A bare call reads as a user function in JavaScript but as a language
  // built-in everywhere else, and the reference colours those two differently.
  function codeToken (language) {
    var bareCall = language === 'javascript' ? 'api-call' : 'api-constant'
    return function (match) {
      if (match[1]) return { text: match[1], className: 'api-call' }
      if (match[2]) return { text: match[2], className: 'api-constant' }
      if (match[3]) return { text: match[3], className: bareCall }
      return { text: match[0], className: 'api-operator' }
    }
  }

  function markTokens (block, pattern, classify) {
    ;[].slice.call(block.childNodes).forEach(function (node) {
      if (node.nodeType !== 3) return
      pattern.lastIndex = 0
      if (!pattern.test(node.nodeValue)) return
      pattern.lastIndex = 0
      var fragment = document.createDocumentFragment()
      var cursor = 0
      var match
      while ((match = pattern.exec(node.nodeValue))) {
        var token = classify(match)
        var start = match.index + match[0].length - token.text.length
        fragment.appendChild(document.createTextNode(node.nodeValue.slice(cursor, start)))
        var span = document.createElement('span')
        span.className = token.className
        span.textContent = token.text
        fragment.appendChild(span)
        cursor = start + token.text.length
      }
      fragment.appendChild(document.createTextNode(node.nodeValue.slice(cursor)))
      node.parentNode.replaceChild(fragment, node)
    })
  }

  window.addEventListener('load', function () {
    find(root, '[data-request-language]').forEach(function (pane) {
      var block = pane.querySelector('code')
      if (!block) return
      var language = pane.getAttribute('data-request-language')
      if (language === 'curl') markTokens(block, SHELL_TOKENS, shellToken)
      else markTokens(block, CODE_TOKENS, codeToken(language))
    })
  })
})()
