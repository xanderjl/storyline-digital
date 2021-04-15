import { Box, Heading } from "@chakra-ui/react"
import Layout from "@components/Layout"
import sanity from "@lib/sanity"
import { groq } from "next-sanity"
import PortableText from "@sanity/block-content-to-react"

const Artist = ({ artist }) => {
  const { name, slug, bio, image, pronouns, socials } = artist

  return (
    <Layout>
      <Box p="3rem 1.25rem">
        <Heading>{name}</Heading>
        <Box maxW="70ch">
          <PortableText blocks={bio} />
        </Box>
      </Box>
    </Layout>
  )
}

const artistsQuery = groq`*[_type == "artist"] { "slug": slug.current }`
const singleArtistQuery = groq`
  *[_type == "artist" && slug.current == $slug] {
    name,
    "slug": slug.current,
    bio,
    image,
    pronouns,
    socials
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
