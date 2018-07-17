export default {
  bindImage: ({index, image, position}) => state => {
    const images = state.images
    const imageData = images[index] || { position: position }
    imageData.src = image
    images[index] = imageData
    return { images }
  },

  setImagePosition: ({index, position}) => state => {
    const images = state.images
    const imageData = images[index]
    imageData.position = position
    return { images }
  },

  deleteImage: (index) => state => {
    const images = state.images
    return {images: images.filter((value, idx) => idx != index)}
  },

  rerender: () => {
    console.log("RERENDER")
    { rerenderflag: Math.random() }
  }
};
