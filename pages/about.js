import { groq } from "next-sanity"
import {
  usePreviewSubscription,
  PortableText,
  urlFor,
  serializers,
} from "@lib/sanity"
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

  const { metaDescription, ogImage, title, tagline, image, body } = bod

  return (
    <>
      <SEO description={metaDescription} ogImageURL={urlFor(ogImage.asset)} />
      <Layout>
        <Container maxW="container.xl" p={{ base: 0, md: "4rem 3rem" }}>
          <Box
            borderRadius={{ base: 0, md: 4 }}
            overflow="hidden"
            bgColor={image?.metadata?.palette?.darkVibrant?.background}
            bgImage={{ md: `url(${image?.metadata?.lqip})` }}
            bgRepeat="no-repeat"
            bgSize="auto"
            bgPosition="0 90%"
          >
            <VStack
              display={{ base: "block", md: "flex" }}
              p="3rem 1.25rem"
              minH={{ base: "max-content", md: "1900px" }}
              color="white"
              textAlign="center"
              bgImage={{ md: `url(${image?.url})` }}
              bgRepeat="inherit"
              bgSize="inherit"
              bgPosition="inherit"
            >
              <Flex
                display="inherit"
                justify="space-between"
                direction="column"
                maxW="90ch"
                minH="inherit"
                align="center"
                justify="space-between"
                m="0 auto"
              >
                <VStack m="0 auto 3rem auto" spacing={6}>
                  <Heading
                    size="xl"
                    p="1rem"
                    my={{ base: "1rem", md: "2rem" }}
                    border="4px solid"
                    borderColor="white"
                    borderRadius={12}
                    maxW="max-content"
                    textTransform="uppercase"
                  >
                    {title}
                  </Heading>
                  <Text fontSize={{ base: "md", md: "xl" }}>{tagline}</Text>
                </VStack>
                <PortableText
                  blocks={body}
                  serializers={{
                    ...serializers,
                    types: {
                      ...serializers.types,
                      image: props => {
                        return (
                          <Image
                            src={urlFor(props.node.asset)}
                            w="auto"
                            h="150px"
                            pb="2rem"
                            m="0 auto"
                          />
                        )
                      },
                    },
                  }}
                />
              </Flex>
            </VStack>
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
