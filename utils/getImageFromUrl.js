import sanity from "@lib/sanity"
import imageUrlBuilder from "@sanity/image-url"

const imageBuilder = imageUrlBuilder(sanity)

const getImageFromUrl = source => imageBuilder.image(source)

export default getImageFromUrl
