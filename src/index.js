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

async function loadInitialImages() {
  for (var i = 0; i < 4; i++) {
    const image = `https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2Flayer_${i}.png`
    console.log(image)
    appActions.bindImage({index: i, image, position: i + 1})
  }
}

loadInitialImages()
