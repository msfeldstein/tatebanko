import { h } from 'hyperapp';
import ComposerTile from './ComposerTile'
import dragNDrop from '../dragdrop'

const makeDraggable = (actions, child, i, container) => {
	console.log(child)
	dragNDrop({
		element: child,
		constraints: 'y',
		callback: (e) => {
			const newPosition = e.element.attributeStyleMap.get('transform')[0].y.value
			const newPercent = newPosition / container.offsetHeight
			actions.setImagePosition({index: i, position: newPercent})
		}
	})
}

const oncreateCreator = (actions) => {
	return (el) => {
		;[].forEach.call(el.children, (child, i) => {
			makeDraggable(actions, child, i, el)
		})
	}
}

export default () => (state, actions) => {  
  return <div oncreate={oncreateCreator(actions)} class="Composer">
    {state.images.map((imageData, index) => {
    	return <ComposerTile
     		image={imageData.src}
     		data={imageData}
     		index={index} 
     		/>
    })}
  </div>;
}
