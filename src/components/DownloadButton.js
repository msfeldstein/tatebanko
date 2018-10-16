import { h } from 'hyperapp';

export default ({label, eventName}) => (state, actions) => {
  console.log(state)
  return <button class="DownloadButton" onclick={() => {
    var event = new Event(eventName);
    window.dispatchEvent(event);
  }}>{label}
  </button>;
}
