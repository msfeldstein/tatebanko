/* global THREE */
import { h } from 'hyperapp';

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  autoClear: false
})
renderer.autoClear = false
renderer.setClearColor(0xffffff)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(100, renderer.getSize().width / renderer.getSize().height / 2, 0.1, 100)

const composerCamera = new THREE.PerspectiveCamera(75, renderer.getSize().width / renderer.getSize().height / 2, 0.1, 100)
composerCamera.position.set(2, 2, 2)
composerCamera.lookAt(new THREE.Vector3())
const cameraHelper = new THREE.CameraHelper(camera)
scene.add(cameraHelper)

const pivot = new THREE.Object3D()
const group = new THREE.Object3D()
pivot.add(group)
group.position.z = 2
scene.add(pivot)
pivot.position.z = -1

const origin = new THREE.Vector3()
function render(t) {
  requestAnimationFrame(render)
  if (!camera) return
  renderer.clear()
  // render preview
  renderer.setViewport(0, 0, renderer.getSize().width / 2, renderer.getSize().height)
  pivot.rotation.x = Math.sin(t / 500) * .02
  pivot.rotation.y = Math.cos(t / 500) * .02
  cameraHelper.visible = false
  renderer.render(scene, camera)

  // render composer
  cameraHelper.visible = true
  renderer.setViewport(renderer.getSize().width / 2, 0, renderer.getSize().width / 2, renderer.getSize().height)
  renderer.render(scene, composerCamera)
}

render()

function attachRenderer(renderHolder) {
  renderHolder.appendChild(renderer.domElement)
  renderer.setSize(renderHolder.offsetWidth, renderHolder.offsetHeight)
  camera.aspect = renderer.getSize().width / renderer.getSize().height / 2
  camera.updateProjectionMatrix()
  camera.position.z = 0
}

function updateState(state) {
  group.traverse((child) => {
    if (!child.material) return
    child.material.map.dispose()
    child.material.dispose()
    child.geometry.dispose()
  })
  group.children = []
  state.images.forEach((imageData, idx) => {
    const tex = new THREE.TextureLoader().load(imageData.src)
    const mat = new THREE.MeshBasicMaterial({map: tex, transparent: true})
    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(.75, 1),
      mat
    )
    const planePivot = new THREE.Object3D()
    planePivot.add(plane)
    plane.position.z = -1
    const scale = 1 + (imageData.position) * 4 * camera.aspect
    planePivot.scale.set(scale, scale, scale)
    group.add(planePivot)
  })

  new THREE.DragControls(composerCamera, group.children, renderer.domElement)
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
    class="Preview"
    oncreate={(el, attrs) => attachRenderer(el)}
    >
  </div>;

}
