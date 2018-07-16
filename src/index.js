import { app } from 'hyperapp'
import actions from './actions'
import state from './state'
import view from './components/Layout'

require('./THREE.GLTFExporter')
require('./GLTFLoader')
require('./THREE.DragControls')

window.state = state
const appActions = app(
  state,
  actions,
  view,
  document.body,
)

const numImages = 4
async function loadInitialImages() {
  for (var i = 0; i < numImages; i++) {
    const image = `https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2Flayer_${i}.png`
    const percent = i / numImages
    appActions.bindImage({index: i, image, position: percent})
  }
}

loadInitialImages()
