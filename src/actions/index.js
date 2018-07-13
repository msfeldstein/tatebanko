export default {
  bindImage: ({index, image, position}) => state => {
    const images = state.images
    const imageData = images[index] || { position: position || 1 }
    console.log(index, image, position, imageData)
    imageData.src = image
    images[index] = imageData
    return { images }
  },

  deleteImage: (index) => state => {
    const images = state.images
    return {images: images.filter((value, idx) => idx != index)}
  }
};
