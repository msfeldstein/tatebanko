import { h } from 'hyperapp';

const dragenter = () => {
  console.log("ENTER")
}

const dragOver = (e) => {
  console.log("DRAG OVER")
  e.preventDefault()
}

const drop = (index, actions) => (e) => {
  e.preventDefault()
  const fileReader = new FileReader()
  fileReader.onload = () => {
    const imageURL = fileReader.result
    actions.bindImage({image: imageURL, index})
  }
  fileReader.readAsDataURL(e.dataTransfer.files[0])
}


const onCreate = (data) => (el) => {
  const containerHeight = el.parentNode.offsetHeight
  el.style.transform = `translate3d(0px, ${data.position * containerHeight}px, 0px)`
}

export default ({image, data, index}) => (state, actions) => {
  return <div
      class="composer-drag-container"
      oncreate={onCreate(data)}
      ondragover={dragOver}
        ondragenter={dragenter}
        ondrop={drop(index, actions)}
      >
      <div
        class="composer-tile"
        >
        <button
          onclick={() => actions.deleteImage(index)}
          class="delete-image">X</button>
      <img src={image} />
    </div>
  </div>;
}
