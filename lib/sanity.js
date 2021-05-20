import { AspectRatio, Box, Heading, Image, Text } from "@chakra-ui/react"
import {
  createImageUrlBuilder,
  createPortableTextComponent,
  createPreviewSubscriptionHook,
} from "next-sanity"
import { config } from "./config"
import ReactPlayer from "react-player"

if (!config.projectId) {
  throw Error("The Project ID is not set. Check your environment variables.")
}
if (!config.dataset) {
  throw Error("The dataset name is not set. Check your environment variables.")
}

/**
 * Set up a helper function for generating Image URLs with only the asset reference data in your documents.
 * Read more: https://www.sanity.io/docs/image-url
 **/
export const urlFor = source => createImageUrlBuilder(config).image(source)

// Set up the live preview subsscription hook
export const usePreviewSubscription = createPreviewSubscriptionHook(config)

export const serializers = {
  types: {
    block: props => {
      const { style = "normal" } = props.node

      switch (style) {
        case "h1":
          return (
            <Heading
              as="h1"
              fontSize="4xl"
              textTransform="uppercase"
              pb="0.5rem"
            >
              {props.children}
            </Heading>
          )
        case "h2":
          return (
            <Heading
              as="h2"
              fontSize="2xl"
              textTransform="uppercase"
              pb="0.5rem"
            >
              {props.children}
            </Heading>
          )
        case "h3":
          return (
            <Heading
              as="h3"
              fontSize="lg"
              textTransform="uppercase"
              pb="0.5rem"
            >
              {props.children}
            </Heading>
          )
        default:
          return <Text pb="1rem">{props.children}</Text>
      }
    },
    image: props => {
      return <Image src={urlFor(props.node.asset)} w="100%" h="auto" p="2rem" />
    },
    youtube: props => {
      return (
        <AspectRatio maxW="100%" my="2rem" ratio={16 / 9}>
          <ReactPlayer
            width="100%"
            height="100%"
            url={props.node.url}
            controls
          />
        </AspectRatio>
      )
    },
  },
}

// Set up Portable Text serialization
export const PortableText = createPortableTextComponent({
  ...config,
  // Serializers passed to @sanity/block-content-to-react
  // (https://github.com/sanity-io/block-content-to-react)
  serializers,
})
