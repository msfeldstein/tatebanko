import { h } from 'hyperapp';


const dragOver = (e) => {
  e.preventDefault()
}

const drop = (index, actions) => (e) => {
  e.preventDefault()
  const fileReader = new FileReader()
  fileReader.onload = () => {
    const imageURL = fileReader.result
    console.log(imageURL)
    actions.bindImage({image: imageURL, index})
  }
  fileReader.readAsDataURL(e.dataTransfer.files[0])
}

export default ({image, index}) => (state, actions) => {
  return <div
      class="composer-tile"
      ondragover={dragOver}
      ondrop={drop(index, actions)}>
    <img src={image} />
  </div>;
}
