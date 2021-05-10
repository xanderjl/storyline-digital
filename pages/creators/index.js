import { useState } from "react"
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from "@chakra-ui/react"
import Fuse from "fuse.js"
import Layout from "@components/Layout"
import { BiSearch } from "react-icons/bi"
import { getClient } from "@lib/sanity"
import { groq } from "next-sanity"
import React from "react"
import Link from "@components/NextLink"
import { urlFor } from "@lib/sanity"
import toPlainText from "utils/getPlainText"
import Card from "@components/Card"
import { IoPerson, IoPersonCircleSharp } from "react-icons/io5"

const Creators = ({ creators, categories }) => {
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
          bg="white"
          borderRadius={6}
          border="1px solid"
          borderColor="warmGray.200"
          boxShadow="lg"
        >
          <InputLeftElement>
            <Icon as={BiSearch} boxSize={6} />
          </InputLeftElement>
          <Input
            placeholder="search for a creator"
            fontSize="xl"
            value={query}
            border="none"
            onChange={e => setQuery(e.target.value)}
          />
        </InputGroup>
      </Container>
      <Container maxW="container.xl">
        <Grid
          py="2rem"
          templateColumns={{
            base: "minmax(0, 1fr)",
            md: "repeat(auto-fill, minmax(40ch, 1fr))",
          }}
          gap={8}
        >
          {creatorResults.map(creator => {
            const { name, slug, bio, image, posts } = creator

            return (
              <Popover key={slug} isLazy>
                <Card alignItems="flex-start">
                  <HStack align="flex-start" spacing={4}>
                    <Box
                      display="inline-block"
                      boxSize={120}
                      bgPosition="center"
                      color="warmGray.500"
                      bgImage={`url(${image?.metadata?.lqip})`}
                      as={!image?.metadata?.lqip && IoPersonCircleSharp}
                      verticalAlign="baseline"
                      bgSize="cover"
                      bgRepeat="no-repeat"
                      borderRadius="50%"
                    >
                      <Image
                        display="inherit"
                        boxSize="inherit"
                        borderRadius="inherit"
                        src={image?.url}
                        objectFit="cover"
                        float="left"
                      />
                      <Box w="120px" h="120px" />
                    </Box>
                    <Box>
                      <Link href={`/creators/`} pb="0.25rem">
                        <Heading>{name}</Heading>
                      </Link>
                      <PopoverTrigger>
                        <Button
                          my="0.5rem"
                          size="sm"
                          colorScheme="complementary"
                        >
                          Overview
                        </Button>
                      </PopoverTrigger>
                    </Box>
                  </HStack>
                </Card>
                <PopoverContent>
                  <PopoverCloseButton />
                  <PopoverBody>
                    <VStack spacing={4} align="flex-start">
                      <Link href={`/creators/${slug}`}>
                        {toPlainText(bio).length > 140
                          ? toPlainText(bio).slice(0, 139) + "..."
                          : toPlainText(bio)}
                      </Link>
                      {posts.length > 0 && (
                        <Box w="100%">
                          <Heading size="md" pb="0.5rem">
                            Latest Posts
                          </Heading>
                          <VStack spacing={2} align="flex-start">
                            {posts.map(post => {
                              const { _id, title, slug } = post
                              return (
                                <Link
                                  key={_id}
                                  href={`/posts/${slug}`}
                                  w="100%"
                                >
                                  <Card
                                    borderColor="complementary.100"
                                    color="gray.700"
                                    _hover={{
                                      borderColor: "complementary.300",
                                      bg: "complementary.300",
                                      color: "white",
                                    }}
                                    p="1rem"
                                    w="100%"
                                  >
                                    <Text>{title}</Text>
                                  </Card>
                                </Link>
                              )
                            })}
                          </VStack>
                        </Box>
                      )}
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
    "image": image.asset->,
    pronouns,
    socials,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
      _id,
      title,
      publishedAt,
      "slug": slug.current,
      categories
    }[0...3]
  }
  `
const categoriesQuery = groq`*[_type == "category"]`

export const getStaticProps = async () => {
  const creators = await getClient().fetch(creatorsQuery)
  const categories = await getClient().fetch(categoriesQuery)

  return { props: { creators, categories } }
}

export default Creators
