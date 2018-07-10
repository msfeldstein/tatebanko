import { app } from 'hyperapp'
import actions from './actions'
import state from './state'
import view from './components/Layout'

const {
  add,
  sub,
} = app(
  state,
  actions,
  view,
  document.body,
)

for (var i = 1; i < 6; i++) {
 const url = `https://cdn.glitch.com/ae47162c-cd2d-4028-9d28-856d2312c256%2F${i}.png?1531189617683` 
 console.log(url)
}