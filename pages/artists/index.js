import { useState } from "react"
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
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
  Text,
} from "@chakra-ui/react"
import Fuse from "fuse.js"
import Layout from "@components/Layout"
import SocialIcons from "@components/SocialIcons"
import { BiSearch } from "react-icons/bi"
import sanity from "@lib/sanity"
import { groq } from "next-sanity"
import PortableText, { getImageUrl } from "@sanity/block-content-to-react"
import React from "react"
import Link from "@components/NextLink"
import getImageFromUrl from "utils/getImageFromUrl"
import toPlainText from "utils/getPlainText"

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
            <Popover key={slug} isLazy>
              <Flex
                direction="column"
                align="center"
                p="3rem"
                boxShadow="sm"
                border="1px solid black"
              >
                <Link href={`/artists/${slug}`} pb="0.25rem">
                  <Heading textAlign="center">{name}</Heading>
                </Link>
                <SocialIcons socials={socials} />
                <PopoverTrigger>
                  <Button
                    m="1rem"
                    size="sm"
                    colorScheme="blackAlpha"
                    borderRadius={0}
                  >
                    Overview
                  </Button>
                </PopoverTrigger>
              </Flex>
              <PopoverContent>
                <PopoverHeader>
                  <Heading size="md">{name}</Heading>
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <Avatar size="2xl" src={getImageFromUrl(image?.asset)} />
                  <Text>{toPlainText(bio).slice(0, 119) + "..."}</Text>
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
