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
  useTheme,
} from "@chakra-ui/react"
import Card from "@components/Card"
import Layout from "@components/Layout"
import Link from "@components/NextLink"
import DateSlider from "@components/DateSlider"
import { getClient, urlFor } from "@lib/sanity"
import groq from "groq"

const Home = ({ posts }) => {
  const theme = useTheme()
  const headerPost = posts[0]
  const gridPosts = posts.filter(post => post !== posts[0])
  const [targetPost, setTargetPost] = useState(gridPosts[0])
  const postRefs = gridPosts.map(() => createRef())

  const headerPostHeight = adjustment => {
    return {
      base: `calc(40vh - 67px ${adjustment})`,
      md: `calc(70vh - 67px ${adjustment})`,
    }
  }

  return (
    <Layout>
      <Box
        maxW="container.xl"
        m={{ base: "5rem 1.25rem", md: "7rem auto 1.25rem auto" }}
      >
        <Box
          h={headerPostHeight}
          m={{ base: 0, md: "0 1.25rem" }}
          borderRadius={14}
          border="4px solid"
          borderColor="auburn.800"
          boxShadow="md"
        >
          <Box
            position="relative"
            h={() => headerPostHeight("- 1rem")}
            m="0.25rem"
            borderRadius={10}
            border="4px solid"
            borderColor="inherit"
            bgImage={`url(${headerPost?.mainImage?.metadata?.lqip})`}
            bgRepeat="no-repeat"
            bgPosition="center"
            bgSize="cover"
          >
            <Box
              w="max-content"
              maxW={{ base: "80%", md: "66%" }}
              position="absolute"
              top={0}
              left="50%"
              zIndex={2}
              textAlign="center"
              textTransform="uppercase"
              transform="translateX(-50%)"
              color="white"
            >
              <Heading
                color="primary.700"
                transform="translateY(calc(-50% - 0.25rem))"
                size={headerPost.title.length > 24 ? "xl" : "2xl"}
                p={{ base: "0.5rem 1rem 0 1rem", md: "1rem 2rem 0.25rem 2rem" }}
                bg="warmGray.50"
                border="4px solid"
                borderColor="auburn.800"
                borderRadius={14}
                boxShadow="md"
              >
                {headerPost.title}
              </Heading>
              <Box
                transform="translateY(-2rem)"
                textShadow={`2px 3px ${theme.colors.primary[800]}`}
              >
                <Heading as="h2" size="xl">
                  {headerPost.creator.name}
                </Heading>
                <Text fontSize="xl" fontFamily="mono">
                  {new Date(headerPost.publishedAt).toLocaleDateString("en-CA")}
                </Text>
              </Box>
            </Box>
            <Box
              overflow="hidden"
              h={() => headerPostHeight("- 1.5rem")}
              borderRadius="inherit"
              backgroundImage={`url(${
                headerPost?.mainImage
                  ? urlFor(headerPost?.mainImage?.url)
                  : "https://via.placeholder.com/1440"
              })`}
              backgroundRepeat="no-repeat"
              backgroundPosition="center"
              backgroundSize="cover"
            ></Box>
          </Box>
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
                    md: "calc(40vh - 57px)",
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
                            role="group"
                            p={0}
                            direction={{ base: "column", md: "row" }}
                            justifyContent="center"
                            alignItems="stretch"
                            color="complementary.100"
                            bg="black"
                            _hover={{ bg: "warmGray.900" }}
                          >
                            <Link
                              href={`/posts/${slug}`}
                              maxW={{ base: "100%", md: "40%" }}
                              bgColor="warmGray.50"
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
                                _groupHover={{ opacity: 0.8 }}
                              />
                            </Link>
                            <Box flex={1} p="2rem">
                              <Link
                                href={`/posts/${slug}`}
                                mb="1rem"
                                fontFamily="mono"
                                color="complementary.200"
                                _groupHover={{ color: "complementary.100" }}
                              >
                                <Box as="span" fontWeight={600}>{`<Entry`}</Box>
                                <Box
                                  pl="1rem"
                                  borderLeft="1px solid"
                                  borderColor={`${theme.colors.complementary[50]}40`}
                                >
                                  <Text size="md" color="primary.100">
                                    title=
                                    <Box as="span" color="white">
                                      "{title}"
                                    </Box>
                                  </Text>
                                  <Text as="h2" size="md" color="primary.100">
                                    name=
                                    <Box as="span" color="white">
                                      "{creator?.name}"
                                    </Box>
                                  </Text>
                                  <Text color="primary.100">
                                    date=
                                    <Box as="span" color="white">
                                      "
                                      {new Date(publishedAt).toLocaleDateString(
                                        "en-CA"
                                      )}
                                      "
                                    </Box>
                                  </Text>
                                </Box>
                                <Box as="span" fontWeight={600}>{` />`}</Box>
                              </Link>
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

const currentYear = new Date(new Date().getFullYear(), 0, 1)
const params = { currentYear }
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
  const posts = await getClient().fetch(postsQuery, params)
  return { props: { posts } }
}

export default Home
