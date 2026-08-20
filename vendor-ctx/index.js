// Third-party style package: calls createContext at module scope, no "use client".
const React = require('react');
const Ctx = React.createContext(null);
module.exports = { Ctx };
