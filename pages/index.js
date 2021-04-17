import { Box, Heading } from "@chakra-ui/layout"
import Layout from "@components/Layout"
import { getClient } from "@lib/sanity"
import groq from "groq"

const Home = ({ posts }) => {
  return (
    <Layout>
      <Box
        p={{ base: "3rem 1.25rem", md: "7rem 1.25rem", xl: "12rem 1.25rem" }}
      >
        <Heading size="4xl">There Will Be Stories Here Soon.</Heading>
        <Box as="pre" h="600px" overflow="scroll">
          {JSON.stringify(posts, null, 2)}
        </Box>
      </Box>
    </Layout>
  )
}

const postsQuery = groq`
  *[_type == "post"] | order(publishedAt) {
    _id,
    artist->,
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
