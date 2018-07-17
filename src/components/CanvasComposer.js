import { h } from 'hyperapp';

const IMAGE_WIDTH = 75
const IMAGE_HEIGHT = 100

const imageCache = function() {
	const _cache = {}
	return (src, onload) => {
		if (!_cache[src]) {
			const img = new Image()
			img.src = src
			_cache[src] = img
			img.onload = onload
		}
		return _cache[src]
	}
}()

const render = (el, state, actions) => {
	const ctx = el.getContext('2d')
	const x = 20
	ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
	state.images.forEach((image, idx) => {
		const img = imageCache(image.src, () => actions.rerender())
		const y = image.position * el.height
		ctx.fillRect(x, y, IMAGE_WIDTH, IMAGE_HEIGHT)
		ctx.drawImage(img, x, y, 75, 100)
		ctx.beginPath()
		ctx.moveTo(x + IMAGE_WIDTH, y + IMAGE_HEIGHT / 2)
		ctx.lineTo(x + IMAGE_WIDTH + 50 - 15, y + IMAGE_HEIGHT / 2)
		ctx.stroke()
		ctx.beginPath()
		ctx.arc(x + IMAGE_WIDTH + 50, y + IMAGE_HEIGHT / 2, 15, 0, Math.PI * 2)
		ctx.stroke()
		ctx.fill()
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


export default () => (state, actions) => {
	return <canvas
		oncreate={onUpdateCreator(state, actions)}
		onupdate={onUpdateCreator(state, actions)}
		onmousedown={mouseDown(state, actions)}
		onmousemove={mouseMove(state, actions)}
		onmouseup={mouseUp(state, actions)}
		/>
}