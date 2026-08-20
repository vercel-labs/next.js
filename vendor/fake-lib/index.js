// A published package that ships pre-scoped CSS (not *.module.css), like
// @cloudscape-design/components does with *.scoped.css files.
require('./styles.scoped.css');

const React = require('react');
module.exports = function Widget() {
  return React.createElement('div', { className: 'awsui_widget_abc123' }, 'widget');
};
