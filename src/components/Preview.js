import { h } from 'hyperapp';

export default () => (state, actions) => {
console.log("state",state)
  return <div
    class="Preview"
    onupdate={() => console.log(this, arguments)}
    >
    Preview
  </div>;
  
}
