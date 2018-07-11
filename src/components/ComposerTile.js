import { h } from 'hyperapp';


const dragOver = (e) => {
  e.preventDefault()
}

const drop = (index, actions) => (e) => {
  e.preventDefault()
  const imageURL = URL.createObjectURL(e.dataTransfer.files[0])
  actions.bindImage({image: imageURL, index})
}

export default ({image, index}) => (state, actions) => {
  return <div
      class="composer-tile"
      ondragover={dragOver}
      ondrop={drop(index, actions)}>
    <img src={image} />
  </div>;
}
