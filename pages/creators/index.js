import { useState } from "react"
import {
  Box,
  Button,
  Container,
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
import { getClient, urlFor } from "@lib/sanity"
import { groq } from "next-sanity"
import React from "react"
import Link from "@components/NextLink"
import toPlainText from "utils/getPlainText"
import Card from "@components/Cards/Card"
import { IoPersonCircleSharp } from "react-icons/io5"
import PageContent from "@components/PageContent"
import RetroCard from "@components/Cards/RetroCard"
import SEO from "@components/SEO"
import CodeBlockCard from "@components/Cards/CodeBlockCard"

const Creators = ({ siteSettings, creators }) => {
  const [query, setQuery] = useState("")
  const fuse = new Fuse(creators, {
    keys: ["name"],
  })
  const results = fuse.search(query)
  const creatorResults = query ? results.map(result => result.item) : creators
  return (
    <>
      <SEO
        description={siteSettings.metaDescription}
        ogImageURL={urlFor(siteSettings.ogImage.asset)}
      />
      <Layout>
        <Container maxW="container.xl">
          <Flex>
            <Heading flex={1} p="1rem 1.25rem">
              Meet the Creators
            </Heading>
            {/* <PageContent p="6rem 1.25rem"> */}
            <InputGroup
              flex={1}
              size="lg"
              borderRadius={12}
              border="3px solid"
              borderColor="auburn.800"
              boxShadow="lg"
              bg="white"
            >
              <InputLeftElement>
                <Icon as={BiSearch} boxSize={6} />
              </InputLeftElement>
              <Input
                placeholder="search for a creator"
                _placeholder={{ color: "primary.700" }}
                fontSize="xl"
                value={query}
                border="none"
                borderRadius={14}
                onChange={e => setQuery(e.target.value)}
              />
            </InputGroup>
          </Flex>
          <Grid
            py="2rem"
            templateColumns={{
              base: "minmax(0, 1fr)",
              md: "repeat(auto-fill, minmax(40ch, 1fr))",
            }}
            gap={6}
            autoRows="200px"
          >
            {creatorResults.map(creator => {
              const { name, slug, bio, image, posts } = creator

              return (
                <Popover key={slug} isLazy>
                  <CodeBlockCard
                    href={`/creators/${slug}`}
                    componentName="Creator"
                    image={image?.url}
                    placeholder={image?.metadata.lqip}
                    creatorName={name}
                    borderRadius={10}
                  />
                  {/* <RetroCard>
                    <HStack p="1.25rem" align="flex-start" spacing={4}>
                    <Link href={`/creators/${slug}`}>
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
                          _hover={{ opacity: 0.8 }}
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
                          </Link>
                          <VStack align="flex-start" spacing={2}>
                          <Link href={`/creators/${slug}`} pb="0.25rem">
                          <Heading>{name}</Heading>
                          </Link>
                          <PopoverTrigger>
                          <Button my="0.5rem">Overview</Button>
                          </PopoverTrigger>
                          </VStack>
                          </HStack>
                        </RetroCard> */}
                  <PopoverContent
                    border="4px solid"
                    borderColor="auburn.800"
                    borderRadius={14}
                    p="1rem"
                    bg="warmGray.50"
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
                                      borderRadius={12}
                                      border="3px solid"
                                      borderColor="auburn.800"
                                      color="gray.700"
                                      bg="warmGray.50"
                                      _hover={{
                                        borderColor: "auburn.800",
                                        bg: "auburn.800",
                                        color: "warmGray.50",
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
          {/* </PageContent> */}
        </Container>
      </Layout>
    </>
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

export const getStaticProps = async () => {
  const siteSettings = await getClient().fetch(groq`*[_type == "siteSettings"]{
    metaDescription,
    ogImage
  }[0]`)
  const creators = await getClient().fetch(creatorsQuery)

  return { props: { siteSettings, creators } }
}

export default Creators
