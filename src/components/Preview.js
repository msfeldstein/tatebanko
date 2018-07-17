/* global THREE */
import { h } from 'hyperapp';

const DEBUG = false

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  autoClear: false
})
renderer.autoClear = false
renderer.setClearColor(0xffffff)

const layerCache = {}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, .75, 0.1, 1000)

const composerCamera = new THREE.PerspectiveCamera(75, renderer.getSize().width / renderer.getSize().height / 2, 0.1, 1000)
// const composerCamera = new THREE.OrthographicCamera(-5, 5, -5, 5)
composerCamera.position.set(2, 2, 2)
composerCamera.lookAt(new THREE.Vector3(0, 0, -3))
const cameraHelper = new THREE.CameraHelper(camera)
scene.add(cameraHelper)

const pivot = new THREE.Object3D()
const group = new THREE.Object3D()
pivot.add(group)
group.position.z = 1
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

  // so it doesn't show up in the export
  cameraHelper.visible = false
}

render()

function attachRenderer(renderHolder) {
  renderHolder.appendChild(renderer.domElement)
  renderer.setSize(renderHolder.offsetWidth, renderHolder.offsetHeight)
  camera.aspect = renderer.getSize().width / renderer.getSize().height / 2
  camera.updateProjectionMatrix()
}

function getOrCreateFromImageData(imageData) {
  if (!layerCache[imageData.src]) {
    const tex = new THREE.TextureLoader().load(imageData.src)
    const mat = new THREE.MeshBasicMaterial({map: tex, transparent: true})
    const s = 1
    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(.75 * s, 1 * s),
      mat
    )
    const planePivot = new THREE.Object3D()
    planePivot.add(plane)
    plane.position.z = -1
    
    if (DEBUG) {
      const debugBox = new THREE.Mesh(
        new THREE.BoxBufferGeometry(.75 * s, 1 * s, 0.01),
        new THREE.MeshBasicMaterial({color: 0xff0000})
      )
      planePivot.add(debugBox)
      debugBox.position.z = plane.position.z  
    }
    
    
    layerCache[imageData.src] = planePivot
  }
  return layerCache[imageData.src]
}

function updateState(state) {
  group.children = [] 
  state.images.forEach((imageData, idx) => {
    let layer = getOrCreateFromImageData(imageData)
    const scale = ((imageData.position))  * 80 + 1
    layer.scale.set(scale, scale, scale)
    group.add(layer)
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
