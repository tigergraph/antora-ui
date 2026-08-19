;(function () {
  'use strict'

  var root = document.querySelector('.page-actions')
  if (!root) return

  var toggle = root.querySelector('.page-actions-toggle')
  var menu = root.querySelector('.page-actions-menu')
  var copyButtons = root.querySelectorAll('[data-page-action="copy"]')
  var copyLabel = root.querySelector('.page-actions-copy-label')
  var mdUrl = root.getAttribute('data-md-url')

  if (!toggle || !menu || !mdUrl) return

  function absoluteUrl (url) {
    try {
      return new URL(url, window.location.href).href
    } catch (e) {
      return url
    }
  }

  function buildPrompt (markdownAbsoluteUrl) {
    // Point assistants at the Markdown twin so they load resolved docs content,
    // not the AsciiDoc source and not the full HTML chrome.
    return (
      'Read this TigerGraph documentation and help me with it:\n' +
      markdownAbsoluteUrl
    )
  }

  /*
   * External assistant URLs
   *
   * ChatGPT: https://chatgpt.com/?q= is the publicly used web prefill mechanism.
   *   There is no documented API for injecting full page bodies via URL.
   *
   * Claude: https://claude.ai/new?q= mirrors the documented desktop
   *   claude://claude.ai/new?q= prefill parameter for browser users. Desktop-only
   *   claude:// links are avoided here because docs are opened in a browser.
   *
   * Cursor: https://cursor.com/link/prompt?text= is the official web deeplink
   *   format (see Cursor deeplink docs). It prefills chat; it does not auto-run.
   */
  function assistantUrl (action, markdownAbsoluteUrl) {
    var prompt = buildPrompt(markdownAbsoluteUrl)
    var encoded = encodeURIComponent(prompt)
    if (action === 'chatgpt') return 'https://chatgpt.com/?q=' + encoded
    if (action === 'claude') return 'https://claude.ai/new?q=' + encoded
    if (action === 'cursor') return 'https://cursor.com/link/prompt?text=' + encoded
    return null
  }

  function setOpen (open) {
    root.classList.toggle('is-active', open)
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
    if (open) menu.removeAttribute('hidden')
    else menu.setAttribute('hidden', '')
  }

  function closeMenu () {
    setOpen(false)
  }

  function setCopyState (label, disabled) {
    if (copyLabel) copyLabel.textContent = label
    Array.prototype.forEach.call(copyButtons, function (btn) {
      btn.disabled = !!disabled
      var title = btn.querySelector('.page-actions-title')
      if (title) title.textContent = label === 'Copied' ? 'Copied' : 'Copy page'
    })
  }

  function copyMarkdown () {
    if (!window.fetch || !window.navigator.clipboard || !window.navigator.clipboard.writeText) {
      setCopyState('Copy failed', false)
      window.setTimeout(function () {
        setCopyState('Copy page', false)
      }, 1600)
      return
    }

    setCopyState('Copying…', true)
    window
      .fetch(mdUrl, { headers: { Accept: 'text/markdown, text/plain;q=0.9, */*;q=0.8' } })
      .then(function (response) {
        if (!response.ok) throw new Error('Failed to fetch markdown')
        return response.text()
      })
      .then(function (markdown) {
        return window.navigator.clipboard.writeText(markdown)
      })
      .then(function () {
        setCopyState('Copied', false)
        window.setTimeout(function () {
          setCopyState('Copy page', false)
        }, 1600)
      })
      .catch(function () {
        setCopyState('Copy failed', false)
        window.setTimeout(function () {
          setCopyState('Copy page', false)
        }, 1600)
      })
  }

  toggle.addEventListener('click', function (e) {
    e.preventDefault()
    e.stopPropagation()
    setOpen(!root.classList.contains('is-active'))
  })

  Array.prototype.forEach.call(copyButtons, function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault()
      e.stopPropagation()
      copyMarkdown()
      closeMenu()
    })
  })

  Array.prototype.forEach.call(root.querySelectorAll('[data-page-action]'), function (el) {
    var action = el.getAttribute('data-page-action')
    if (!action || action === 'copy') return
    var href = assistantUrl(action, absoluteUrl(mdUrl))
    if (href) el.setAttribute('href', href)
    el.addEventListener('click', function () {
      closeMenu()
    })
  })

  document.documentElement.addEventListener('click', function () {
    closeMenu()
  })

  root.addEventListener('click', function (e) {
    e.stopPropagation()
  })

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu()
  })
})()
