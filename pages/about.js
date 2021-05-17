import { useRouter } from "next/router"
import { groq } from "next-sanity"
import {
  getClient,
  usePreviewSubscription,
  PortableText,
  urlFor,
} from "@lib/sanity"
import { Box, Container, Heading } from "@chakra-ui/layout"
import Layout from "@components/Layout"
import PageContent from "@components/PageContent"
import SEO from "@components/SEO"

const About = ({ data, preview }) => {
  const router = useRouter()

  const { data: bod = {} } = usePreviewSubscription(aboutBodyQuery, {
    initialData: data,
    enabled: preview || router.query.preview !== null,
  })

  const { metaDescription, ogImage, title, tagline, image, body } = bod

  return (
    <>
      <SEO description={metaDescription} ogImageURL={urlFor(ogImage.asset)} />
      <Layout>
        <Container maxW="container.xl" color="white">
          <Box
            position="absolute"
            w="100%"
            h="100%"
            bgImage={`url(${image?.metadata?.lqip})`}
            bgRepeat="no-repeat"
            bgSize="cover"
            bgPosition="center"
            zIndex={-1}
          >
            <Box
              position="absolute"
              w="100%"
              h="100%"
              bgImage={`url(${urlFor(image?.url)})`}
              bgRepeat="no-repeat"
              bgSize="cover"
              bgPosition="center"
              zIndex={-1}
            />
          </Box>
          <Heading
            size="4xl"
            p="1rem"
            border="4px solid"
            borderColor="white"
            borderRadius={12}
            maxW="max-content"
            textTransform="uppercase"
          >
            {title}
          </Heading>
          <Box maxW="70ch" textAlign="center">
            <PortableText blocks={tagline} />
          </Box>
          <Box maxW="70ch" textAlign="center">
            <PortableText blocks={body} />
          </Box>
        </Container>
      </Layout>
    </>
  )
}

const aboutBodyQuery = groq`*[_type == "aboutPage"]{
  title,
  tagline,
  "image": image.asset->,
  body,
}[0]`

export const getStaticProps = async () => {
  const siteSettings = await getClient().fetch(groq`*[_type == "siteSettings"]{
    metaDescription,
    ogImage
  }[0]`)
  const aboutBody = await getClient().fetch(aboutBodyQuery)

  return { props: { data: { ...siteSettings, ...aboutBody } } }
}

export default About
