import { useState } from "react"
import {
  Box,
  Flex,
  Grid,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react"
import Fuse from "fuse.js"
import Layout from "@components/Layout"
import SocialIcons from "@components/SocialIcons"
import { BiSearch } from "react-icons/bi"
import sanity from "@lib/sanity"
import { groq } from "next-sanity"
import PortableText from "@sanity/block-content-to-react"
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
            <Popover isLazy>
              <PopoverTrigger>
                <Flex
                  direction="column"
                  align="center"
                  key={slug}
                  p="3rem"
                  boxShadow="sm"
                  border="1px solid black"
                >
                  <Link href={`/artists/`} pb="0.25rem">
                    <Heading textAlign="center">{name}</Heading>
                  </Link>
                  <SocialIcons socials={socials} />
                </Flex>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>{name}</PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <PortableText blocks={bio} />
                </PopoverBody>
              </PopoverContent>
            </Popover>
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
