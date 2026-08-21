// Minimal custom element, simulating a CDN-hosted web component library.
class MySelect extends HTMLElement {
  menuList = []
  connectedCallback() {
    this.innerHTML = '<button>select</button>'
    this.querySelector('button').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('my-change', { detail: { value: 'apple' } }))
    })
  }
}
customElements.define('my-select', MySelect)
