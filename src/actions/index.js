export default {
  bindImage: (index, image) => state => { 
    const images = state.images
    images[index] = image
    console.log("IMages", images)
    return { images }
  },
};
