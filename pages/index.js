import { Box, Grid, Heading, Text } from "@chakra-ui/layout"
import Card from "@components/Card"
import Layout from "@components/Layout"
import Link from "@components/NextLink"
import { getClient } from "@lib/sanity"
import groq from "groq"

const Home = ({ posts }) => {
  return (
    <Layout>
      <Box
        p={{ base: "3rem 1.25rem", md: "7rem 1.25rem", xl: "12rem 1.25rem" }}
      >
        <Heading size="4xl">There Will Be Stories Here Soon.</Heading>
        <Grid>
          {posts.map(post => {
            const { _id, title, publishedAt, slug, body, artist } = post
            return (
              <Card key={_id}>
                <Link href={`/posts/${slug}`}>
                  <Heading>{title}</Heading>
                </Link>
                <Link href={`/artists/${artist?.slug}`}>
                  <Heading>{artist?.slug}</Heading>
                </Link>
                <Text>{new Date(publishedAt).toLocaleDateString("en-CA")}</Text>
              </Card>
            )
          })}
        </Grid>
      </Box>
    </Layout>
  )
}

const postsQuery = groq`
  *[_type == "post"] | order(publishedAt) {
    _id,
    artist->{
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
