import { useState } from "react"
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
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
import { getClient } from "@lib/sanity"
import { groq } from "next-sanity"
import React from "react"
import Link from "@components/NextLink"
import { urlFor } from "@lib/sanity"
import toPlainText from "utils/getPlainText"
import Card from "@components/Card"

const Creators = ({ creators }) => {
  const [query, setQuery] = useState("")
  const fuse = new Fuse(creators, {
    keys: ["name"],
  })
  const results = fuse.search(query)
  const creatorResults = query ? results.map(result => result.item) : creators
  return (
    <Layout>
      <Container maxW="container.xl" px="1.25rem" pt="3rem">
        <InputGroup
          size="lg"
          bg="beige.50"
          border="1px solid"
          borderColor="brown.900"
          borderRadius={0}
          boxShadow="sm"
        >
          <InputLeftElement>
            <Icon as={BiSearch} boxSize={6} />
          </InputLeftElement>
          <Input
            placeholder="search for a creator"
            _placeholder={{ color: "brown.500" }}
            fontSize="xl"
            value={query}
            border="none"
            onChange={e => setQuery(e.target.value)}
          />
        </InputGroup>
      </Container>
      <Container maxW="container.xl">
        <Grid
          p="3rem 1.25rem"
          templateColumns={{
            base: "minmax(0, 1fr)",
            md: "repeat(auto-fill, minmax(40ch, 1fr))",
          }}
          gap={8}
        >
          {creatorResults.map(creator => {
            const { name, slug, bio, image, pronouns, posts } = creator
            console.log(bio.length)
            return (
              <Popover key={slug} isLazy>
                <Card>
                  <Link href={`/creators/${slug}`} pb="0.25rem">
                    <Heading textAlign="center">{name}</Heading>
                  </Link>
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
                <PopoverContent
                  borderRadius={0}
                  bg="beige.50"
                  borderColor="brown.900"
                >
                  <PopoverHeader borderColor="brown.900">
                    <Link href={`/creators/${slug}`}>
                      <Heading size="md">{name}</Heading>
                    </Link>
                  </PopoverHeader>
                  <PopoverCloseButton />
                  <PopoverBody>
                    <VStack spacing={4} align="flex-start">
                      <Link href={`/creators/${slug}`}>
                        <Avatar
                          size="xl"
                          src={urlFor(image?.asset)}
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
      </Container>
    </Layout>
  )
}
const creatorsQuery = groq`*[_type == "creator"] | order(name) {
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
  const creators = await getClient().fetch(creatorsQuery)

  return { props: { creators } }
}

export default Creators
