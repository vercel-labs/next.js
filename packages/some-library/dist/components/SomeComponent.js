import React from 'react'
export default function SomeComponent(props) {
  return React.createElement('div', { id: 'some-component' }, props.children)
}
