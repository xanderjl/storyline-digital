import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/layout"
import Card from "@components/Card"
import Layout from "@components/Layout"
import Link from "@components/NextLink"
import { getClient, urlFor } from "@lib/sanity"
import groq from "groq"

import { Image } from "@chakra-ui/image"

const Home = ({ posts }) => {
  const headerPost = posts[0]
  const gridPosts = posts.filter(post => post !== posts[0])
  return (
    <Layout>
      <Box
        h="calc(100vh - 67px)"
        backgroundImage={`url(${
          headerPost?.mainImage
            ? urlFor(headerPost.mainImage)
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
          p={{ base: "3rem 1.25rem", md: "7rem 1.25rem", xl: "12rem 1.25rem" }}
        >
          <Link
            href={`/posts/${headerPost.slug}`}
            pos="absolute"
            left="1.25rem"
            bottom="20%"
            bg="complementary.200"
            p="1.75rem 3rem"
            borderRadius={6}
          >
            <Heading size="4xl">{headerPost.title}</Heading>
            <Heading as="h2" size="2xl">
              {headerPost.creator.name}
            </Heading>
            <Text fontSize="xl">
              {new Date(headerPost.publishedAt).toLocaleDateString("en-CA")}
            </Text>
          </Link>
        </Container>
      </Box>
      <Container
        maxW="container.xl"
        p={{ base: "3rem 1.25rem", md: "7rem 1.25rem", xl: "12rem 1.25rem" }}
      >
        <Grid templateColumns={{ base: "minmax(0, 1fr)", md: "5fr 1fr" }}>
          <Grid
            templateColumns={{ base: "minmax(0, 1fr)", lg: "repeat(12, 1fr)" }}
            gap={8}
            rowGap="6rem"
          >
            {gridPosts.map((post, i) => {
              const { _id, title, publishedAt, slug, mainImage, creator } = post
              return (
                <GridItem
                  key={_id}
                  id={`#${_id}`}
                  colStart={{
                    base: 0,
                    lg: i % 2 === 0 ? 0 : 6,
                  }}
                  colSpan={{ base: 1, lg: 6 }}
                >
                  <Card
                    p={0}
                    direction={{ base: "column", md: "row" }}
                    justifyContent="flex-start"
                    alignItems="flex-start"
                  >
                    <Link
                      maxW={{ base: "100%", md: "50%" }}
                      maxH="100%"
                      href={`/posts/${slug}`}
                    >
                      <Image
                        objectFit="cover"
                        src={urlFor(mainImage)}
                        fallbackSrc="https://via.placeholder.com/400"
                      />
                    </Link>
                    <Box flex={1} p="2rem">
                      <Link href={`/posts/${slug}`} mb="1rem">
                        <Heading>{title}</Heading>
                      </Link>
                      <Link href={`/artists/${creator?.slug}`}>
                        <Heading as="h2" size="md">
                          {creator?.name}
                        </Heading>
                      </Link>
                      <Text>
                        {new Date(publishedAt).toLocaleDateString("en-CA")}
                      </Text>
                    </Box>
                  </Card>
                </GridItem>
              )
            })}
          </Grid>
          <VStack display={{ base: "none", md: "flex" }}>
            {gridPosts.map(post => {
              const { _id, publishedAt } = post
              return (
                <Link key={_id} href={`#${_id}`}>
                  <Text>
                    {new Date(publishedAt).toLocaleDateString("en-CA")}
                  </Text>
                </Link>
              )
            })}
          </VStack>
        </Grid>
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
    mainImage,
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
