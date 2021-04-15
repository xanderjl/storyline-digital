import { Box, Grid, Heading } from "@chakra-ui/react"
import Layout from "@components/Layout"
import SocialIcons from "@components/SocialIcons"
import sanity from "@lib/sanity"
import groq from "groq"
import React from "react"
import Link from "@components/NextLink"

const Artists = ({ artists }) => {
  return (
    <Layout>
      <Grid
        p="3rem 1.25rem"
        templateColumns="repeat(auto-fill, minmax(40ch, 1fr))"
        gap={8}
      >
        {artists.map(artist => {
          const { name, slug, bio, image, pronouns, socials } = artist
          return (
            <Box key={slug} p="3rem 1.25rem" boxShadow="md">
              <Link href={`/artists/${slug}`} pb="2rem">
                <Heading>{name}</Heading>
              </Link>
              <SocialIcons socials={socials} />
            </Box>
          )
        })}
      </Grid>
    </Layout>
  )
}
const artistsQuery = groq`*[_type == "artist"] {
    name,
    "slug": slug.current,
    bio,
    image,
    pronouns,
    socials
  }`

export const getStaticProps = async () => {
  const artists = await sanity.fetch(artistsQuery)

  return { props: { artists } }
}

export default Artists
