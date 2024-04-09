const IMAGE_MODELS = {
  "dall-e-2": {
    n: [1, 2],
    size: ["256x256", "512x512"]
  },
  "dall-e-3": {
    style: ["vivid", "natural"],
    size: ["1024x1024", "1792x1024", "1024x1792"],
    quality: ["standard", "standard"],
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function castImageModelProp({ prop, val }) {
  if (prop === 'n') return Number(val)
  return String(val)
}
function getImageModelProps(model) {
  let props = IMAGE_MODELS[model]
  let result = {}
  Object.keys(props).forEach(key => {
    result[capitalize(key)] = {
      name: key, values: props[key]
    }
  })
  return result
}

const getImageModels = () => Object.keys(IMAGE_MODELS)

export {
  getImageModels,
  getImageModelProps,
  IMAGE_MODELS,
  castImageModelProp
}
