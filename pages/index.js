import { useEffect } from "react"
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/layout"
import Card from "@components/Card"
import Layout from "@components/Layout"
import Link from "@components/NextLink"
import { getClient } from "@lib/sanity"
import groq from "groq"

import testPosts from "@lib/testPosts"
import { Image } from "@chakra-ui/image"

const Home = ({ posts }) => {
  const headerPost = testPosts[0]
  testPosts.shift()
  useEffect(() => {}, [])
  return (
    <Layout>
      <Box
        h="calc(100vh - 62px)"
        // pos="relative"
        // p={{ base: "3rem 1.25rem", md: "7rem 1.25rem", xl: "12rem 1.25rem" }}
        backgroundImage="url(http://www.fillmurray.com/1440/1440)"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundSize="cover"
      >
        <Container
          h="100%"
          pos="relative"
          maxW="container.xl"
          color="white"
          // p={{ base: "3rem 1.25rem", md: "7rem 1.25rem", xl: "12rem 1.25rem" }}
        >
          <Heading size="4xl" pos="absolute" left="1.25rem" bottom="20%">
            {headerPost.title}
          </Heading>
        </Container>
      </Box>
      <Container
        maxW="container.xl"
        p={{ base: "3rem 1.25rem", md: "7rem 1.25rem", xl: "12rem 1.25rem" }}
      >
        <Heading size="4xl" pb="2rem">
          There Will Be Stories Here Soon.
        </Heading>
        <Grid
          templateColumns={{ base: "minmax(0, 1fr)", md: "repeat(5, 1fr)" }}
          gap={8}
        >
          {testPosts.map((post, i) => {
            const { _id, title, publishedAt, slug, body, creator } = post
            return (
              <GridItem
                key={_id}
                colStart={{
                  base: 0,
                  md: i % 2 === 0 ? 0 : 2,
                  lg: i % 2 === 0 ? 0 : 3,
                }}
                colSpan={{ base: 1, md: 4, lg: 3 }}
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
                      src="http://www.fillmurray.com/800/800"
                    />
                  </Link>
                  <Box flex={1} p="2rem">
                    <Link href={`/posts/${slug}`}>
                      <Heading>{title}</Heading>
                    </Link>
                    <Link href={`/artists/${creator?.slug}`}>
                      <Heading>{creator?.name}</Heading>
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
      </Container>
    </Layout>
  )
}

const postsQuery = groq`
  *[_type == "post"] | order(publishedAt) {
    _id,
    creator->{
      name,
      "slug": slug.current,
    },
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
