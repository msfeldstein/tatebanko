import { h } from 'hyperapp';

export default () => (state, actions) => {
  window.state = state
  return <div class="Composer">
    {state.images.map((image) => {
     return <img class="composer-tile" src={image} />
    })}
  </div>;
}
