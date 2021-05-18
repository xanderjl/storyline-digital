import { groq } from "next-sanity"
import {
  getClient,
  usePreviewSubscription,
  PortableText,
  urlFor,
} from "@lib/sanity"
import { Box, Container, Flex, Heading, Text, VStack } from "@chakra-ui/layout"
import Layout from "@components/Layout"
import SEO from "@components/SEO"

const About = ({ data, preview }) => {
  const { data: bod } = usePreviewSubscription(aboutBodyQuery, {
    initialData: data,
    enabled: preview,
  })

  const { metaDescription, ogImage, title, tagline, image, body } = bod

  return (
    <>
      <SEO description={metaDescription} ogImageURL={urlFor(ogImage.asset)} />
      <Layout>
        <Box
          position="absolute"
          left="50%"
          top={0}
          transform="translate(-50%, 0)"
          w="container.xl"
          h="100%"
          bgColor={image?.metadata?.palette?.darkVibrant?.background}
          bgImage={{ md: `url(${image?.metadata?.lqip})` }}
          bgRepeat="no-repeat"
          bgSize="auto"
          bgPosition="0% 120%"
          zIndex={-1}
        >
          <Box
            position="inherit"
            w="inherit"
            h="inherit"
            bgImage={{ md: `url(${image?.url})` }}
            bgRepeat="inherit"
            bgSize="inherit"
            bgPosition="inherit"
            zIndex="inherit"
          />
        </Box>
        <Container
          p="3rem 1.25rem"
          position="relative"
          minH={{ base: "max-content", md: "1800px" }}
          maxW="container.xl"
          color="white"
          textAlign="center"
        >
          <Flex
            direction="column"
            minH="inherit"
            align="center"
            justify="space-between"
          >
            <VStack m="0 auto 3rem auto" spacing={6}>
              <Heading
                size="2xl"
                p="1rem"
                m="0 auto"
                border="4px solid"
                borderColor="white"
                borderRadius={12}
                maxW="max-content"
                textTransform="uppercase"
              >
                {title}
              </Heading>
              <Text maxW="90ch">{tagline}</Text>
            </VStack>
            <Box maxW="90ch">
              <PortableText blocks={body} />
            </Box>
          </Flex>
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
