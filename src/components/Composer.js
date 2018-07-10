import { h } from 'hyperapp';
import ComposerTile from './ComposerTile'
export default () => (state, actions) => {
  return <div class="Composer">
    {state.images.map((image, index) => {
     return <ComposerTile image={image} index={index} />
    })}
  </div>;
}
