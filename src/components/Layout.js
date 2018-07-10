import { h } from 'hyperapp';
import Preview from './Preview'
import Composer from './Composer'

export default ({ num }, { add, sub }) =>
  <div class="Layout">
    <div class="Header">
      Tatebanko Creator
    </div>
    <div class="Container">
      <Preview />
      <Composer />
    </div>
  </div>;
