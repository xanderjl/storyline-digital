import { groq } from "next-sanity"
import { usePreviewSubscription, PortableText, urlFor } from "@lib/sanity"
import { getClient } from "@lib/sanity.server"
import { Box, Container, Flex, Heading, Text, VStack } from "@chakra-ui/layout"
import Layout from "@components/Layout"
import SEO from "@components/SEO"
import { Image } from "@chakra-ui/image"

const About = ({ data, preview }) => {
  const { data: bod } = usePreviewSubscription(aboutBodyQuery, {
    initialData: data,
    enabled: preview,
  })

  const { metaDescription, ogImage, title, tagline, image, glyphs, body } = bod

  return (
    <>
      <SEO description={metaDescription} ogImageURL={urlFor(ogImage.asset)} />
      <Layout>
        <Container
          maxW="container.xl"
          p={{ base: "3rem 1.25rem", md: "4rem 3rem" }}
        >
          <Box
            borderRadius={4}
            overflow="hidden"
            bgColor={image?.metadata?.palette?.darkVibrant?.background}
            bgImage={{ md: `url(${image?.metadata?.lqip})` }}
            bgRepeat="no-repeat"
            bgSize="auto"
            bgPosition="0 90%"
          >
            <Box
              p="3rem 1.25rem"
              position="relative"
              minH={{ base: "max-content", md: "1900px" }}
              color="white"
              textAlign="center"
              bgImage={{ md: `url(${image?.url})` }}
              bgRepeat="inherit"
              bgSize="inherit"
              bgPosition="inherit"
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
                    my="2rem"
                    border="4px solid"
                    borderColor="white"
                    borderRadius={12}
                    maxW="max-content"
                    textTransform="uppercase"
                  >
                    {title}
                  </Heading>
                  <Text fontSize="xl" maxW="70ch">
                    {tagline}
                  </Text>
                </VStack>
                <VStack maxW="90ch" spacing={8}>
                  <Image
                    src={glyphs.url}
                    w="auto"
                    h={{ base: "90px", md: "118px" }}
                  />
                  <PortableText blocks={body} />
                </VStack>
              </Flex>
            </Box>
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
  "glyphs": glyphs.asset->,
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
