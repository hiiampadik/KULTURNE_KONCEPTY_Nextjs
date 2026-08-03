import imageUrlBuilder from '@sanity/image-url'
import client from './client'

const builder = imageUrlBuilder(client)

// Build a Sanity image URL (returns the builder so callers can chain .width()/.height()/… )
export function urlForImage(source: Parameters<typeof builder.image>[0]) {
    return builder.image(source)
}
