export default {
  bindImage: (index, image) => ({ images }) => { 
    images[index] = image
    return { images }
  },
};
