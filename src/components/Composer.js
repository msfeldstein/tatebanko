import { h } from 'hyperapp';

export default () => (state, actions) => {
  console.log("State", state)
  window.state = state
  return <div class="Composer">
    {state.images.map((image) => {
     return image
    })}
  </div>;
}
