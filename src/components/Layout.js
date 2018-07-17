import { h } from 'hyperapp';
import Preview from './Preview'
import Composer from './CanvasComposer'
import DownloadButton from './DownloadButton'

export default ({ num }, { add, sub }) =>
  <div class="Layout">
    <div class="Header">
      Tatebanko Creator
      <DownloadButton />
    </div>
    <div class="Container">
      <Preview />
      <div class="Composer">
        <Composer />
      </div>
    </div>
  </div>;
