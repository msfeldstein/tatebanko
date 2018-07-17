import { h } from 'hyperapp';
import Konva from 'konva'

const IMAGE_WIDTH = 75
const IMAGE_HEIGHT = 100
const TOP_PADDING = 60
const BOTTOM_PADDING = 60

const offsetToPercent = (offset, height) => {
	return (offset - TOP_PADDING) / (height - TOP_PADDING - BOTTOM_PADDING)
}

const percentToOffset = (percent, height) => {
	return TOP_PADDING + (height - TOP_PADDING - BOTTOM_PADDING) * percent
}

const dragEnd = (actions, idx, stage) => (e) => {
	const percent = offsetToPercent(e.evt.offsetY, stage.getHeight())
	actions.setImagePosition({index: idx, position: percent})
	console.log("DRAG END", e, percent)
}

let stage;
const render = (el, state, actions) => {
	stage = new Konva.Stage({
	  container: el.id,
	  width: el.parentNode.offsetWidth,
	  height: el.parentNode.offsetHeight
	});

	state.images.forEach((image, idx) => {
		var layer = new Konva.Layer({
			draggable: true,
			dragBoundFunc: function(pos) {
	            return {
	                x: this.getAbsolutePosition().x,
	                y: pos.y
	            }
	        }
		});
		layer._imageIndex = idx
		stage.add(layer)
		const y = percentToOffset(image.position, el.height)
		var circle = new Konva.Circle({
			x: stage.getWidth() - 30,
			y: y,
			radius: 10,
			fill: 'gray',
			stroke: 'black',
			strokeWidth: 1,
			
		});
		
		const line = new Konva.Line({
			x: 20 + IMAGE_WIDTH,
			y: circle.position().y,
			points: [0, 0, circle.position().x - (20 + IMAGE_WIDTH), 0],
			stroke: 'black'
		})
		layer.add(line)
		layer.add(circle);

		Konva.Image.fromURL(image.src, (image) => {
			image.size({
				width: 75,
				height: 100
			})
			window.image = image
			window.layer = layer
			image.fill('rgba(0.2,0.2,0.2, 0.1)')
			image.position({
				x: 20,
				y: y - IMAGE_HEIGHT / 2
			})
			layer.add(image);
			layer.draw();
		});

		layer.on('dragend', dragEnd(actions, idx, stage))
		layer.draw()
	})
	
}


const onUpdateCreator = (state, actions) => {
	return (el) => {
		el.width = el.parentNode.offsetWidth
		el.height = el.parentNode.offsetHeight
		render(el, state, actions)

	}
}

let draggedItem = null

const mouseDown = (state, actions) => (e) => {
	draggedItem = true
}

const mouseMove = (state, actions) => (e) => {
	if (draggedItem) {
		const percent = (e.offsetY - IMAGE_HEIGHT / 2) / e.target.height 
		actions.setImagePosition({index: 0, position: percent})	
	}
	
}

const mouseUp = (state, actions) => (e) => {
	draggedItem = null
}

const onDragOver = (e) => {

	e.preventDefault()
}

const onDrop = (actions) => (e) => {
	e.preventDefault()
	console.log(e)
	const pos = {
		x: e.offsetX,
		y: e.offsetY
	}
	const ix = stage.getIntersection(pos)
	console.log("IX", ix)
	const layer = ix.findAncestor('Layer')
	const idx = layer._imageIndex;
	console.log("layer index", idx, layer)
	const fileReader = new FileReader()
	fileReader.onload = () => {
		const imageURL = fileReader.result
		actions.bindImage({image: imageURL, index: idx})
		console.log("Image", imageURL)
	}
	fileReader.readAsDataURL(e.dataTransfer.files[0])

}

export default () => (state, actions) => {
	return <div id="CanvasComposer"
		oncreate={onUpdateCreator(state, actions)}
		onupdate={onUpdateCreator(state, actions)}
		ondragover={onDragOver}
		ondrop={onDrop(actions)}
		// onmousedown={mouseDown(state, actions)}
		// onmousemove={mouseMove(state, actions)}
		// onmouseup={mouseUp(state, actions)}
		></div>
}