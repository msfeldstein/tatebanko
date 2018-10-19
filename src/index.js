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

// australia
// const initialImages = [
// 	'https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2Faustralia_0.png',
// 	'https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2Faustralia_1.png',
// 	'https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2Faustralia_2.png',
// 	'https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2Faustralia_3.jpg',
// ]

// vox machina
const initialImages = [
  'https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2Ftitle.png?1539921589026',
  'https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2Frobots.png?1539921591261',
  'https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2Fmountains.png?1539921586269',
  'https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2FBG.png?1539921592656'
]

// const initialImages = [
// 	'https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2Flayer_0.png',
// 	'https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2Flayer_1.png',
// 	'https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2Flayer_2.png',
// 	'https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2Flayer_3.png'
// ]
async function loadInitialImages() {
	initialImages.forEach((image, i) => {
		const percent = i / initialImages.length
		appActions.bindImage({index: i, image, position: percent})
	})
}

loadInitialImages()
