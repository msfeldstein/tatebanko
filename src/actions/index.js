export default {
  bindImage: ({index, image}) => state => {
    const images = state.images
    images[index] = image
    console.log("IMages", image, images)
    return { images }
  },

  startDownload: () => {
    return { shouldDownload: true }
  },

  endDownload: () => {
    return { shouldDownload: false }
  }
};
