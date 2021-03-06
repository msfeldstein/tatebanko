/* global THREE */
import { h } from 'hyperapp';

const DEBUG = window.location.hash.indexOf('debug') != -1
const DEFAULT_V_FOV = 0.666488587;
const DEFAULT_H_FOV = 0.508015513;
const ASPECT_RATIO = .75//Math.tan(DEFAULT_H_FOV / 2) / Math.tan(DEFAULT_V_FOV / 2);
const FOV = 35.32295939408245
const ROTATION_FACTOR = 0.06;
const CAMERA_RADIUS = 1;
const GYRO_SPEED = 0.005;
const MAX_ZOOM = 0.1;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  autoClear: false,
  preserveDrawingBuffer: true
})
renderer.autoClear = false
renderer.setClearColor(0xffffff)

const layerCache = {}

const scene = new THREE.Scene()
window.scene = scene
const camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, 0.1, 3000)
let composerCamera = new THREE.PerspectiveCamera(FOV, renderer.getSize().width / renderer.getSize().height / 2, 0.1, 2000)
composerCamera.position.set(2, 2, 2)
composerCamera.lookAt(new THREE.Vector3(0, 0, -3))
if (DEBUG) {
  composerCamera = new THREE.OrthographicCamera(-500, 500, -500, 500, 1, 1000)
  composerCamera.position.set(500, 0, -250)
  composerCamera.lookAt(new THREE.Vector3(0, 0, -250))
}
const cameraHelper = new THREE.CameraHelper(camera)
scene.add(cameraHelper)

const pivot = new THREE.Object3D()
const group = new THREE.Object3D()
group.name = "Container"
pivot.add(group)
group.position.z = 1
scene.add(pivot)
pivot.position.z = -1

let photo3dXTarget = 0
let photo3dYTarget = 0

renderer.domElement.addEventListener('mousemove', e => {
  const w = renderer.getSize().width / 2
  const h = renderer.getSize().height
  const paddedW = Math.min(w - 40, (h - 80) * 3 / 4)
  const paddedH = paddedW * 4 / 3
  const padLeft = (w - paddedW) / 2
  const padTop = (h - paddedH) / 4
  photo3dXTarget = ((e.offsetX - padLeft) / paddedW)
  photo3dYTarget = ((e.offsetY - padTop) / paddedH)
  photo3dXTarget = 1 - Math.min(1, Math.max(photo3dXTarget, 0))
  photo3dYTarget = Math.min(1, Math.max(photo3dYTarget, 0))
  photo3dXTarget = photo3dXTarget * 0.1 - 0.05
  photo3dYTarget = photo3dYTarget * 0.1 - 0.05
})

const origin = new THREE.Vector3()
const cameraTarget = new THREE.Vector3()
function render(t) {
  requestAnimationFrame(render)
  if (!camera) return
  renderer.setClearColor(0xffffff)
  renderer.clear()
  // render preview
  const w = renderer.getSize().width / 2
  const h = renderer.getSize().height
  const paddedW = Math.min(w - 40, (h - 80) * 3 / 4)
  const paddedH = paddedW * 4 / 3
  const padLeft = (w - paddedW) / 2
  const padTop = (h - paddedH) / 4
  renderer.setScissor(0, 0, w, h)
  renderer.setScissorTest(true)
  renderer.setClearColor(0x000000)
  renderer.clear()
  renderer.setScissor(padLeft, padTop, paddedW, paddedH)
  renderer.setClearColor(0xff0000)
  renderer.clear()
  renderer.setScissorTest(false)
  renderer.setViewport(padLeft, padTop, paddedW, paddedH)

  const percent = 0
  const pitch = photo3dYTarget
  const yaw = photo3dXTarget
  const scrollPitch = 0
  const targetDistributeH = 0.6
  const targetDistributeV = 0.7
  const targetMaxH = -0.03219230681522755
  const targetMaxV = -0.03876922981457388

  const realPhoto3dY = Math.sin(photo3dYTarget * Math.PI * 0.5); // [-1, 1]
  const realPhoto3dX = Math.sin(photo3dXTarget * Math.PI * 0.5);
  const targetV = -realPhoto3dY * targetMaxV; // [_targetMaxV, _targetMaxV]
  const targetH = -realPhoto3dX * targetMaxH;
  const zoom =
      Math.pow(percent + 0.16, 3) /
        (Math.pow(percent + 0.16, 3) + Math.pow(1 - (percent + 0.16), 3)) -
      0.9;
    const newPitch = -(pitch + scrollPitch); // [-2*vfov, 2*vfov]
    const newYaw = -yaw;
    const r = CAMERA_RADIUS - zoom * MAX_ZOOM;

    // target is a combination of scroll and user interaction
    cameraTarget.set(
      -((1 - targetDistributeH) * targetH),
      -(1 - targetDistributeV) * targetV,
      -CAMERA_RADIUS,
    ); // [scrollTargetV, targetV]
    camera.position.set(
      0 + r * Math.cos(newPitch) * Math.sin(newYaw),
      0 + r * Math.sin(newPitch),
      -CAMERA_RADIUS + r * Math.cos(newPitch) * Math.cos(newYaw),
    );
    camera.lookAt(cameraTarget);






  camera.lookAt(pivot.position)
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
  camera.aspect = ASPECT_RATIO
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
    plane.name = imageData.src
    const planePivot = new THREE.Object3D()
    planePivot.add(plane)
    plane.position.z = -.73
    
    if (DEBUG) {
      const debugBox = new THREE.Mesh(
        new THREE.BoxBufferGeometry(.75 * s, 1 * s, 0.01),
        new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff})
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
    const scale = Math.pow(imageData.position, 3)  * 1800 + 1
    layer.scale.set(scale, scale, scale * 1.75)
    group.add(layer)
  })

  new THREE.DragControls(composerCamera, group.children, renderer.domElement)
}

function download() {
  const exporter = new THREE.GLTFExporter()
  const container = scene.getObjectByName("Container")
  container.children.sort((a, b) => a.scale.z - b.scale.z)
  exporter.parse(scene, function(gltf) {
    const blob = new Blob([gltf], {type: 'application/octet-stream'})
    var objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = 'tatebanko.glb'
    a.click()
  }, {
    binary: true,
    forcePowerOfTwoTextures: true
  })
}

function downloadImage() {
  const canvas = renderer.domElement
  const oldWidth = canvas.width
  const oldHeight = canvas.height
  canvas.width = 1536
  canvas.height = 2048
  renderer.setScissorTest(false)
  // pivot.rotation.x = 0
  // pivot.rotation.y = 0
  camera.position.set(0, 0, 0)
  camera.lookAt(new THREE.Vector3(0, 0, -1))
  renderer.setSize(canvas.width, canvas.height)
  renderer.setViewport(0, 0, canvas.width, canvas.height)
  renderer.render(scene, camera)
  const data = renderer.domElement.toDataURL("image/jpeg")
  const a = document.createElement('a')
  a.href = data
  a.download = 'fallback.jpg'
  a.click()
  canvas.width = oldWidth
  canvas.height = oldHeight
  renderer.setSize(oldWidth, oldHeight)
}

window.addEventListener('download-gltf', download)
window.addEventListener('download-image', downloadImage)
export default () => (state, actions) => {
  updateState(state)
  return <div
    class="Preview"
    oncreate={(el, attrs) => attachRenderer(el)}
    >
  </div>;

}
