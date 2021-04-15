import {
  Avatar,
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  VStack,
} from "@chakra-ui/react"
import Layout from "@components/Layout"
import sanity from "@lib/sanity"
import { groq } from "next-sanity"
import PortableText from "@sanity/block-content-to-react"
import Card from "@components/Card"
import Link from "@components/NextLink"
import getImageFromUrl from "utils/getImageFromUrl"
import SocialIcons from "@components/SocialIcons"

const Artist = ({ artist }) => {
  const { name, slug, bio, image, pronouns, socials, posts } = artist

  return (
    <Layout>
      <Container maxW="container.xl" p="3rem 1.25rem">
        <VStack spacing={6} align="flex-start">
          <Flex>
            <Avatar
              size="2xl"
              src={getImageFromUrl(image.asset)}
              mr="1.25rem"
            />
            <Box maxW="70ch">
              <Heading>{name}</Heading>
              <PortableText blocks={bio} />
            </Box>
          </Flex>
          <SocialIcons socials={socials} />
          <Grid
            templateColumns={{
              base: "minmax(0, 1fr)",
              md: "repeat(auto-fill, minmax(40ch, 1fr))",
            }}
            gap={8}
          >
            {posts.map(post => {
              const { _id, title, slug, pushlishedAt, categories } = post
              return (
                <Link key={_id} href={`/posts/${slug}`}>
                  <Card>
                    <Heading>{title}</Heading>
                  </Card>
                </Link>
              )
            })}
          </Grid>
        </VStack>
      </Container>
    </Layout>
  )
}

const artistsQuery = groq`*[_type == "artist"] { "slug": slug.current }`
const singleArtistQuery = groq`
  *[_type == "artist" && slug.current == $slug] {
    _id,
    name,
    "slug": slug.current,
    bio,
    image,
    pronouns,
    socials,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt) {
      _id,
      title,
      publishedAt,
      "slug": slug.current,
      categories
    }
  }[0]
`

export const getStaticPaths = async () => {
  const artists = await sanity.fetch(artistsQuery)
  const paths = artists.map(artist => ({
    params: { slug: artist.slug },
  }))

  return { paths, fallback: false }
}

export const getStaticProps = async ({ params }) => {
  const artist = await sanity.fetch(singleArtistQuery, { slug: params.slug })

  return { props: { artist } }
}

export default Artist
