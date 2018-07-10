import { h } from 'hyperapp';

export default () => (state, actions) => {
console.log("state",state)
  return <div
    class="Preview"
    onupdate={(el, attrs) => console.log("update", el, attrs)}
    oncreate={(el, attrs) => console.log("create", el, attrs)}
    >
    Preview
  </div>;
  
}
