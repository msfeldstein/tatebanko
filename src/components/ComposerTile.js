import { h } from 'hyperapp';

export default ({image, index}) => (state, actions) => {
  return <div class="composer-tile">
    <img src={image} />
  </div>;
}
