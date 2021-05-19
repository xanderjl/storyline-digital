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
  Image,
} from "@chakra-ui/react"
import Layout from "@components/Layout"
import DateSlider from "@components/DateSlider"
import { urlFor } from "@lib/sanity"
import { getClient } from "@lib/sanity.server"
import groq from "groq"
import CodeBlockCard from "@components/Cards/CodeBlockCard"
import SEO from "@components/SEO"
import Card from "@components/Cards/Card"
import Link from "@components/NextLink"

const Home = ({ siteSettings, posts }) => {
  const theme = useTheme()
  const headerPost = posts[0]
  const gridPosts = posts.filter(post => post !== posts[0])
  const [targetPost, setTargetPost] = useState(gridPosts[0])
  const postRefs = gridPosts.map(() => createRef())

  return (
    <>
      <SEO
        description={siteSettings.metaDescription}
        ogImageURL={urlFor(siteSettings.ogImage.asset)}
      />
      <Layout>
        <Box
          position="fixed"
          top={0}
          left="50%"
          viewBox="0 0 530 1024"
          transform="translate(-55%, 0)"
          bgImage="url(./Background.svg)"
          h="100vh"
          w="100%"
          bgSize={{ base: "cover", md: "contain" }}
          bgRepeat="no-repeat"
          bgPosition="center"
          zIndex={-1}
        />
        <Container maxW="container.xl" pt="3rem" px=" 1.25rem">
          <Heading pb="3rem" textTransform="uppercase">
            Entering Archive
          </Heading>
          <VStack spacing={{ base: 6, md: 14 }}>
            <Box
              p="4px"
              border="4px solid"
              borderColor="auburn.800"
              borderRadius={12}
            >
              <Card
                role="group"
                maxH={{ base: "100%", md: "460px" }}
                p={0}
                direction={{ base: "column", md: "row" }}
                justifyContent="center"
                alignItems="center"
                color="complementary.100"
                bg="coolGray.900"
                _hover={{ bg: "warmGray.900" }}
                boxShadow="md"
              >
                <Link
                  href={`/posts/${headerPost.slug}`}
                  maxW={{ base: "100%", md: "60%" }}
                  bgColor="warmGray.50"
                >
                  <Image
                    objectFit="cover"
                    h={{ base: "300px", md: "100%" }}
                    w="100%"
                    objectFit="cover"
                    bgImage={`url(${headerPost?.mainImage?.metadata?.lqip})`}
                    bgRepeat="no-repeat"
                    bgPosition="center"
                    bgSize="cover"
                    src={urlFor(headerPost?.mainImage?.url)}
                    _groupHover={{ opacity: 0.8 }}
                  />
                </Link>
                <Box flex={1} p="2rem">
                  <Link
                    href={`/posts/${headerPost.slug}`}
                    mb="1rem"
                    fontFamily="mono"
                    fontSize={{ base: "xl", md: "2xl" }}
                    color="complementary.400"
                    _groupHover={{ color: "complementary.100" }}
                  >
                    <Box as="span" fontWeight={600}>{`<Entry`}</Box>
                    <Box
                      pl="1rem"
                      borderLeft="1px solid"
                      borderColor={`${theme.colors.complementary[50]}40`}
                    >
                      {headerPost?.title && (
                        <Text size="md" color="primary.100">
                          title=
                          <Box as="span" color="white">
                            "{headerPost?.title}"
                          </Box>
                        </Text>
                      )}
                      {headerPost?.creator?.name && (
                        <Text as="h2" size="md" color="primary.100">
                          name=
                          <Box as="span" color="white">
                            "{headerPost?.creator?.name}"
                          </Box>
                        </Text>
                      )}
                      {headerPost?.publishedAt && (
                        <Text color="primary.100">
                          date=
                          <Box as="span" color="white">
                            "
                            {new Date(
                              headerPost?.publishedAt
                            ).toLocaleDateString("en-CA")}
                            "
                          </Box>
                        </Text>
                      )}
                    </Box>
                    <Box as="span" fontWeight={600}>{` />`}</Box>
                  </Link>
                </Box>
              </Card>
            </Box>
            <Flex alignItems="flex-start" pt="80px" pb="3rem">
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
                        md: "320px",
                      }}
                      colStart={{
                        base: 0,
                        lg: i % 2 === 0 ? 6 : 0,
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
                                href={`/posts/${slug}`}
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
          </VStack>
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
