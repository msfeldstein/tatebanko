import { h } from 'hyperapp';
import ComposerTile from './ComposerTile'
export default () => (state, actions) => {
  return <div class="Composer">
    {state.images.map((imageData, index) => {
     return <ComposerTile image={imageData.src} index={index} />
    })}
  </div>;
}
