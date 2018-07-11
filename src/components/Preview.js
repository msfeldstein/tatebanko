/* global THREE */
import { h } from 'hyperapp';


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
}

render()

function attachRenderer(renderHolder) {
  renderHolder.appendChild(renderer.domElement)
  renderer.setSize(renderHolder.offsetWidth, renderHolder.offsetWidth * 1.6)
}

function updateState(state) {
  scene.children.forEach((child) => {
    scene.remove(child)
    child.material.map.dispose()
    child.material.dispose()
    child.geometry.dispose()
  })
  state.images.forEach((src, i) => {
    const tex = new THREE.TextureLoader().load(src)
    const mat = new THREE.MeshBasicMaterial({map: tex, transparent: true})
    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1),
      mat
    )
    plane.position.z = -.04 * i
    scene.add(plane)
  })
}

function download() {
  const exporter = new THREE.GLTFExporter()
  exporter.parse(scene, function(gltf) {
    const blob = new Blob([gltf], {type: 'application/octet-stream'})
    var objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = 'tatebanko.glb'
    a.click()
  }, {
    binary: true
  })
}

window.addEventListener('download-gltf', download)

export default () => (state, actions) => {
  updateState(state)
  return <div
    onupdate={(el, attrs) => console.log("update", el, attrs)}
    oncreate={(el, attrs) => attachRenderer(el)}
    >
  </div>;

}
