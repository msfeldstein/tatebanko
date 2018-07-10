import { app } from 'hyperapp'
import actions from './actions'
import state from './state'
import view from './components/Layout'
window.state = state
const appActions = app(
  state,
  actions,
  view,
  document.body,
)

function attachImage(index, image) {
  return function() {
    console.log(index, image, 'yes')
    appActions.bindImage({index, image})
  }
}

async function loadInitialImages() {
  for (var i = 1; i < 6; i++) {
    const image = `https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2F${i}.png?1531189617683` 
    appActions.bindImage({index: i, image})
  }  
}

loadInitialImages()