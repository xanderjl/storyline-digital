import { ChakraProvider } from "@chakra-ui/react"
import { DefaultSeo } from "next-seo"
import theme from "@theme"
import Fonts from "@components/Fonts"

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <DefaultSeo
        description="Storyline Digital"
        defaultTitle="Storyline Digital"
        openGraph={{
          type: "website",
          locale: "en_CA",
          url: "https://www.storyline.digital/",
          site_name: "Storyline Digital",
        }}
        twitter={{
          handle: "@handle",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
