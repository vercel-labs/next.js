// Minimal stand-in for an imperative DOM library (Mapbox GL / Leaflet / Three.js).
// The important part is that `destroy()` throws away the internal DOM reference,
// exactly like `mapboxgl.Map#remove()` (`this._container = null`) or `map.remove()`
// in Leaflet.
export class FakeMap {
  constructor(container) {
    this._container = container
    this._canvas = document.createElement('div')
    this._canvas.textContent = 'map canvas'
    this._container.appendChild(this._canvas)
  }
  remove() {
    this._canvas.remove()
    this._container = null // <- library is now in a "destroyed" state
  }
}

export class Marker {
  addTo(map) {
    // mapboxgl.Marker#addTo does `map.getCanvasContainer().appendChild(this._element)`
    this._element = document.createElement('span')
    this._element.textContent = 'marker'
    map._container.appendChild(this._element) // throws when map was destroyed
    return this
  }
  remove() {
    this._element?.remove()
  }
}
