import { useState, createRef } from "react"
import { InView } from "react-intersection-observer"
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  useTheme,
} from "@chakra-ui/react"
import Layout from "@components/Layout"
import DateSlider from "@components/DateSlider"
import { getClient, urlFor } from "@lib/sanity"
import groq from "groq"
import CodeBlockCard from "@components/Cards/CodeBlockCard"
import SEO from "@components/SEO"

const Home = ({ siteSettings, posts }) => {
  const theme = useTheme()
  const headerPost = posts[0]
  const gridPosts = posts.filter(post => post !== posts[0])
  const [targetPost, setTargetPost] = useState(gridPosts[0])
  const postRefs = gridPosts.map(() => createRef())

  const headerPostHeight = adjustment => {
    return {
      base: `calc(40vh - 67px ${adjustment})`,
      md: `calc(75vh - 67px ${adjustment})`,
    }
  }

  return (
    <>
      <SEO
        description={siteSettings.metaDescription}
        ogImageURL={urlFor(siteSettings.ogImage.asset)}
      />
      <Layout>
        <Box
          maxW={{ base: "container.xl", "2xl": "80vw" }}
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
                  p={{
                    base: "0.5rem 1rem 0 1rem",
                    md: "1rem 2rem 0.25rem 2rem",
                  }}
                  bg="warmGray.50"
                  border="4px solid"
                  borderColor="auburn.800"
                  borderRadius={14}
                  boxShadow="md"
                >
                  {headerPost.title}
                </Heading>
                <Box
                  transform="translateY(-1rem)"
                  textShadow={`2px 3px ${theme.colors.primary[800]}`}
                >
                  <Heading as="h2" size="xl">
                    {headerPost.creator.name}
                  </Heading>
                  <Text fontSize="xl" fontFamily="mono">
                    {new Date(headerPost.publishedAt).toLocaleDateString(
                      "en-CA"
                    )}
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
              templateColumns={{
                base: "minmax(0, 1fr)",
                lg: "repeat(12, 1fr)",
              }}
              gap={12}
            >
              {gridPosts.map((post, i) => {
                const { _id, title, publishedAt, slug, mainImage, creator } =
                  post

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
                            <CodeBlockCard
                              componentName="Entry"
                              image={mainImage?.url}
                              placeholder={mainImage?.metadata?.lqip}
                              href={`/creators/${slug}`}
                              title={title}
                              creatorName={creator?.name}
                              date={publishedAt}
                            />
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
    </>
  )
}

const currentYear = new Date(new Date().getFullYear(), 0, 1)
const params = { currentYear }
const postsQuery = groq`
  *[_type == "post" && publishedAt > $currentYear] | order(publishedAt desc) {
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
  const siteSettings = await getClient().fetch(groq`*[_type == "siteSettings"]{
    metaDescription,
    ogImage
  }[0]`)
  const posts = await getClient().fetch(postsQuery, params)
  return { props: { siteSettings, posts } }
}

export default Home
