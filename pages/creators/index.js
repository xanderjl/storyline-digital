import { useState } from "react"
import {
  Box,
  Button,
  Flex,
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
import toPlainText from "utils/getPlainText"
import Card from "@components/Card"
import { IoPersonCircleSharp } from "react-icons/io5"
import PageContent from "@components/PageContent"

const Creators = ({ creators, categories }) => {
  const [query, setQuery] = useState("")
  const fuse = new Fuse(creators, {
    keys: ["name"],
  })
  const results = fuse.search(query)
  const creatorResults = query ? results.map(result => result.item) : creators
  return (
    <Layout>
      <PageContent title="Meet the Creators">
        <InputGroup
          size="lg"
          borderRadius={14}
          border="2px solid"
          borderColor="auburn.800"
          boxShadow="lg"
        >
          <InputLeftElement>
            <Icon as={BiSearch} boxSize={6} />
          </InputLeftElement>
          <Input
            placeholder="search for a creator"
            _placeholder={{ color: "warmGray.700" }}
            fontSize="xl"
            value={query}
            border="none"
            borderRadius={14}
            onChange={e => setQuery(e.target.value)}
          />
        </InputGroup>
        <Grid
          py="2rem"
          templateColumns={{
            base: "minmax(0, 1fr)",
            md: "repeat(auto-fill, minmax(40ch, 1fr))",
          }}
          gap={12}
        >
          {creatorResults.map(creator => {
            const { name, slug, bio, image, posts } = creator

            return (
              <Popover key={slug} isLazy>
                <Flex
                  justifyContent="center"
                  borderTop="4px solid"
                  borderBottom="4px solid"
                  borderColor="analogous.600"
                >
                  <HStack p="3rem 1.25rem" align="flex-start" spacing={4}>
                    <Box
                      href={`/creators/${slug}`}
                      display="inline-block"
                      boxSize={140}
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
                        minW={140}
                        minH={140}
                        display="inherit"
                        boxSize="inherit"
                        borderRadius="inherit"
                        src={image?.url}
                        objectFit="cover"
                        float="left"
                      />
                    </Box>
                    <VStack align="flex-start" spacing={2}>
                      <Link href={`/creators/${slug}`} pb="0.25rem">
                        <Heading>{name}</Heading>
                      </Link>
                      <PopoverTrigger>
                        <Button my="0.5rem">Overview</Button>
                      </PopoverTrigger>
                    </VStack>
                  </HStack>
                </Flex>
                <PopoverContent
                  border="4px solid"
                  borderColor="analogous.600"
                  borderRadius={0}
                  p="1rem"
                >
                  <PopoverCloseButton color="analogous.800" />
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
                                    borderRadius={0}
                                    border="2px solid"
                                    borderColor="analogous.600"
                                    color="gray.700"
                                    _hover={{
                                      borderColor: "analogous.600",
                                      bg: "analogous.600",
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
      </PageContent>
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
