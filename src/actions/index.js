export default {
  bindImage: ({index, image}) => state => {
    const images = state.images
    images[index] = image
    return { images }
  },

  deleteImage: (index) => state => {
    console.log("INDEX?", index)
    const images = state.images
    console.log("I", images.filter((value, idx) => console.log(idx, 'idx') && idx != index))
    return {images: images.filter((value, idx) => idx != index)}
  }
};
