import { useState, createRef } from "react"
import { InView } from "react-intersection-observer"
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react"
import Card from "@components/Card"
import Layout from "@components/Layout"
import Link from "@components/NextLink"
import DateSlider from "@components/DateSlider"
import { getClient, urlFor } from "@lib/sanity"
import groq from "groq"

const Home = ({ posts }) => {
  const headerPost = posts[0]
  const gridPosts = posts.filter(post => post !== posts[0])
  const [targetPost, setTargetPost] = useState(gridPosts[0])
  const postRefs = gridPosts.map(() => createRef())

  return (
    <Layout>
      <Box
        h="calc(80vh - 67px)"
        bgImage={`url(${headerPost?.mainImage?.metadata?.lqip})`}
        bgRepeat="no-repeat"
        bgPosition="center"
        bgSize="cover"
      >
        <Box
          h="inherit"
          backgroundImage={`url(${
            headerPost?.mainImage
              ? urlFor(headerPost?.mainImage?.url)
              : "https://via.placeholder.com/1440"
          })`}
          backgroundRepeat="no-repeat"
          backgroundPosition="center"
          backgroundSize="cover"
        >
          <Container
            h="100%"
            pos="relative"
            maxW="container.xl"
            color="white"
            p={{
              base: "3rem 1.25rem",
              md: "7rem 1.25rem",
              xl: "12rem 1.25rem",
            }}
          >
            <Link
              href={`/posts/${headerPost.slug}`}
              pos="absolute"
              right="1.25rem"
              bottom="5%"
              bg="black"
              maxW="60ch"
              p="1.75rem 3rem"
              borderRadius={6}
              _hover={{
                bg: "complementary.500",
                color: "white",
              }}
            >
              <Heading size="4xl">{headerPost.title}</Heading>
              <Heading as="h2" fontFamily="body" size="2xl">
                {headerPost.creator.name}
              </Heading>
              <Text fontSize="xl">
                {new Date(headerPost.publishedAt).toLocaleDateString("en-CA")}
              </Text>
            </Link>
          </Container>
        </Box>
      </Box>
      <Container
        maxW="container.xl"
        p={{ base: "3rem 1.25rem", md: "7rem 1.25rem", xl: "12rem 1.25rem" }}
      >
        <Flex alignItems="flex-start">
          <Grid
            templateColumns={{ base: "minmax(0, 1fr)", lg: "repeat(12, 1fr)" }}
            gap={12}
          >
            {gridPosts.map((post, i) => {
              const { _id, title, publishedAt, slug, mainImage, creator } = post
              return (
                <GridItem
                  key={_id}
                  ref={postRefs[i]}
                  minH={{
                    base: "max-content",
                    md: "calc(60vh - 57px)",
                  }}
                  colStart={{
                    base: 0,
                    lg: i % 2 === 0 ? 0 : 6,
                  }}
                  colSpan={{ base: 1, lg: 6 }}
                >
                  <InView rootMargin="0px 0px -75% 0px">
                    {({ inView, ref }) => {
                      if (inView) {
                        setTargetPost(
                          gridPosts[
                            gridPosts.findIndex(item => item._id === _id)
                          ]
                        )
                      }
                      return (
                        <Box ref={ref} minH="inherit">
                          <Card
                            p={0}
                            direction={{ base: "column", md: "row" }}
                            justifyContent="flex-start"
                            alignItems="stretch"
                            color="complementary.100"
                            bg="black"
                          >
                            <Link
                              href={`/posts/${slug}`}
                              maxW={{ base: "100%", md: "40%" }}
                            >
                              <Image
                                objectFit="cover"
                                h={{ base: "300px", md: "100%" }}
                                w="100%"
                                objectFit="cover"
                                bgImage={`url(${mainImage?.metadata?.lqip})`}
                                bgRepeat="no-repeat"
                                bgPosition="center"
                                bgSize="cover"
                                src={urlFor(mainImage?.url)}
                                fallbackSrc="https://via.placeholder.com/400"
                              />
                            </Link>
                            <Box flex={1} p="2rem">
                              <Link href={`/posts/${slug}`} mb="1rem">
                                <Heading
                                  size="lg"
                                  fontFamily="mono"
                                >{`<title>${title}</title>`}</Heading>
                              </Link>
                              <Link href={`/creators/${creator?.slug}`}>
                                <Heading as="h2" fontFamily="body" size="md">
                                  {`<name="${creator?.name}" />`}
                                </Heading>
                              </Link>
                              <Text>
                                {`<date="${new Date(
                                  publishedAt
                                ).toLocaleDateString("en-CA")}" />`}
                              </Text>
                            </Box>
                          </Card>
                        </Box>
                      )
                    }}
                  </InView>
                </GridItem>
              )
            })}
          </Grid>
          <Box
            display={{ base: "none", md: "inline-block" }}
            position="sticky"
            top={24}
            pl="1rem"
          >
            <VStack spacing={4}>
              <Heading as="h3" size="lg">
                Entries
              </Heading>
              <DateSlider
                posts={gridPosts}
                targetPost={targetPost}
                onChange={e => {
                  postRefs[e].current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  })
                  setTargetPost(gridPosts[e])
                }}
              />
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Layout>
  )
}

const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    creator->{
      name,
      "slug": slug.current,
    },
    "mainImage": mainImage.asset->,
    body,
    categories,
    publishedAt,
    "slug": slug.current,
    title,
  }
`

export const getStaticProps = async () => {
  const posts = await getClient().fetch(postsQuery)
  return { props: { posts } }
}

export default Home
