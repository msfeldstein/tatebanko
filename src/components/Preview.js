import { h } from 'hyperapp';

export default () => (state, actions) => {
console.log("state",state)
  return <div class="Preview">
    Preview Num {state.num}
  </div>;
  
}
