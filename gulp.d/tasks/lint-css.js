'use strict'

const stylelint = require('stylelint')

module.exports = (files) => () =>
  stylelint.lint({ files, formatter: 'string' }).then((result) => {
    if (result.output) process.stdout.write(result.output)
    if (result.errored) {
      const error = new Error('Failed with stylelint errors')
      error.showStack = false
      throw error
    }
  })
