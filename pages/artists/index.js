import { useState } from "react"
import {
  Avatar,
  Box,
  Button,
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
  VStack,
} from "@chakra-ui/react"
import Fuse from "fuse.js"
import Layout from "@components/Layout"
import SocialIcons from "@components/SocialIcons"
import { BiSearch } from "react-icons/bi"
import sanity from "@lib/sanity"
import { groq } from "next-sanity"
import React from "react"
import Link from "@components/NextLink"
import getImageFromUrl from "utils/getImageFromUrl"
import toPlainText from "utils/getPlainText"
import Card from "@components/Card"
import Posts from "pages/posts"

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
          bg="beige.50"
          border="1px solid"
          borderColor="black"
          borderRadius={0}
          boxShadow="sm"
        >
          <InputLeftElement>
            <Icon as={BiSearch} boxSize={6} />
          </InputLeftElement>
          <Input
            placeholder="search for an artist"
            _placeholder={{color: "brown.500"}}
            fontSize="xl"
            value={query}
            border="none"
            onChange={e => setQuery(e.target.value)}
          />
        </InputGroup>
      </Box>
      <Grid
        p="3rem 1.25rem"
        templateColumns={{
          base: "minmax(0, 1fr)",
          md: "repeat(auto-fill, minmax(40ch, 1fr))",
        }}
        gap={8}
      >
        {artistResults.map(artist => {
          const { name, slug, bio, image, pronouns, socials, posts } = artist
          console.log(bio.length)

          return (
            <Popover key={slug} isLazy>
              <Card>
                <Link href={`/artists/${slug}`} pb="0.25rem">
                  <Heading textAlign="center">{name}</Heading>
                </Link>
                <SocialIcons socials={socials} />
                <PopoverTrigger>
                  <Button
                    m="1rem"
                    size="sm"
                    colorScheme="brown"
                    borderRadius={0}
                  >
                    Overview
                  </Button>
                </PopoverTrigger>
              </Card>
              <PopoverContent borderRadius={0} bg="beige.50" borderColor="brown.900">
                <PopoverHeader borderColor="brown.900">
                  <Link href={`/artists/${slug}`}>
                    <Heading size="md">{name}</Heading>
                  </Link>
                </PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <VStack spacing={4} align="flex-start">
                    <Link href={`/artists/${slug}`}>
                      <Avatar
                        size="xl"
                        src={getImageFromUrl(image?.asset)}
                        m="0.5rem"
                        float="left"
                      />
                      {toPlainText(bio).length > 140
                        ? toPlainText(bio).slice(0, 139) + "..."
                        : toPlainText(bio)}
                    </Link>
                    <Box w="100%">
                      <Heading size="md" pb="0.5rem">
                        Latest Posts
                      </Heading>
                      <VStack spacing={2} align="flex-start">
                        {posts.map(post => {
                          const { _id, title, slug } = post
                          return (
                            <Link key={_id} href={`/posts/${slug}`} w="100%">
                              <Card p="1rem" w="100%">
                                <Heading size="sm">{title}</Heading>
                              </Card>
                            </Link>
                          )
                        })}
                      </VStack>
                    </Box>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )
        })}
      </Grid>
    </Layout>
  )
}
const artistsQuery = groq`*[_type == "artist"] | order(name) {
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
  }`

export const getStaticProps = async () => {
  const artists = await sanity.fetch(artistsQuery)

  return { props: { artists } }
}

export default Artists
