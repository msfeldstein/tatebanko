import { h } from 'hyperapp';
import * as THREE from 'three';

const allCanvases = []

const drawCanvasContainer = document.querySelector('#draw-canvases')

const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setClearColor(0xffffff)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, renderer.getSize().width / renderer.getSize().width, 0.1, 100)
camera.position.z = 1
camera.lookAt(new THREE.Vector3)

const origin = new THREE.Vector3()
function render(t) {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
  camera.position.x = Math.cos(t / 1000) * .05
  camera.position.y = Math.sin(t / 1212) * .05
  // camera.lookAt(origin)
}

render()

function attachRenderer(renderHolder) {
  renderHolder.appendChild(renderer.domElement)
  window.rh = renderHolder
  renderer.setSize(renderHolder.offsetWidth, renderHolder.offsetWidth)
}

function updateState(state) {
  state.images.forEach((src, i) => {
    const tex = new THREE.TextureLoader().load(src)
    const mat = new THREE.MeshBasicMaterial({map: tex, transparent: true})
    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1),
      mat
    )
    plane.position.z = .08 * i
    scene.add(plane)
  })
}

export default () => (state, actions) => {
  updateState(state)
  return <div
    class="Preview"
    onupdate={(el, attrs) => console.log("update", el, attrs)}
    oncreate={(el, attrs) => attachRenderer(el)}
    >
    Preview
  </div>;
  
}
