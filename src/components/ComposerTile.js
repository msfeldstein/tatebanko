import { h } from 'hyperapp';


const dragEnter = (e) => {
  e.preventDefault()
  console.log("ENTER", e) 
}

const drop = (index, actions) => (e) => {
  e.preventDefault() 
  console.log("Drop on ", index)
  actions.bindImage({image, index})
}

export default ({image, index}) => (state, actions) => {
  return <div
      class="composer-tile"
      ondragover={dragEnter}
      ondrop={drop(index, actions)}>
    <img src={image} />
  </div>;
}
