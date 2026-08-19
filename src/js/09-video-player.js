;(function () {
  'use strict'

  var forEach = Array.prototype.forEach
  var PLAY_ICON =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' +
    '<path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.5-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z"/>' +
    '</svg>'

  forEach.call(document.querySelectorAll('.doc .videoblock > .content'), function (content) {
    var video = content.querySelector('video')
    if (!video || content.querySelector('.video-play-overlay')) return

    var overlay = document.createElement('button')
    overlay.type = 'button'
    overlay.className = 'video-play-overlay'
    overlay.setAttribute('aria-label', 'Play video')
    overlay.innerHTML = '<span class="video-play-icon">' + PLAY_ICON + '</span>'
    content.appendChild(overlay)

    overlay.addEventListener('click', function () {
      var playing = video.play()
      if (playing && typeof playing.catch === 'function') playing.catch(function () {})
    })

    video.addEventListener('play', function () {
      content.classList.add('is-playing')
    })
    video.addEventListener('pause', function () {
      content.classList.remove('is-playing')
    })
    video.addEventListener('ended', function () {
      content.classList.remove('is-playing')
    })

    if (!video.paused) content.classList.add('is-playing')
  })
})()
