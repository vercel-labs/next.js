'use strict'
const React = require('react')

exports.Hello = function Hello() {
  return React.createElement('p', { id: 'from-pkg' }, 'hello from cjs-pkg')
}
