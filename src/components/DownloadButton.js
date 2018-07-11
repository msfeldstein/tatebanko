import { h } from 'hyperapp';

export default () => (state, actions) => {
  return <button class="DownloadButton" onclick={() => {
    var event = new Event('download-gltf');
    window.dispatchEvent(event);
  }}>Save
  </button>;
}
