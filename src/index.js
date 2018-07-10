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
    appActions.bindImage({index, image})
  }
}

async function loadInitialImages() {
  for (var i = 0; i < 5; i++) {
    const image = `https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2F${i}.png?1531239787953`
    appActions.bindImage({index: i, image})
  }  
}

loadInitialImages()