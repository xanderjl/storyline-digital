import { useState } from "react"
import {
  Box,
  Grid,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import Fuse from "fuse.js"
import Layout from "@components/Layout"
import SocialIcons from "@components/SocialIcons"
import { BiSearch } from "react-icons/bi"
import sanity from "@lib/sanity"
import groq from "groq"
import React from "react"
import Link from "@components/NextLink"

const Artists = ({ artists }) => {
  const [query, setQuery] = useState("")
  const fuse = new Fuse(artists, {
    keys: ["name"],
  })
  const results = fuse.search(query)
  const artistResults = query ? results.map(result => result.item) : artists
  return (
    <Layout>
      <Box px="1.25rem" pt="3rem">
        <InputGroup
          size="lg"
          border="1px solid"
          borderColor="black"
          borderRadius={0}
        >
          <InputLeftElement>
            <Icon as={BiSearch} boxSize={6} />
          </InputLeftElement>
          <Input
            placeholder="search for an artist"
            fontSize="xl"
            value={query}
            border="none"
            onChange={e => setQuery(e.target.value)}
          />
        </InputGroup>
      </Box>
      <Grid
        p="3rem 1.25rem"
        templateColumns="repeat(auto-fill, minmax(40ch, 1fr))"
        gap={8}
      >
        {artistResults.map(artist => {
          const { name, slug, bio, image, pronouns, socials } = artist
          return (
            <Box
              key={slug}
              p="3rem 1.25rem"
              boxShadow="sm"
              border="1px solid black"
            >
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
