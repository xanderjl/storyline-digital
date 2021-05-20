import { useState } from "react"
import {
  Container,
  Flex,
  Grid,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import Fuse from "fuse.js"
import Layout from "@components/Layout"
import { BiSearch } from "react-icons/bi"
import { urlFor } from "@lib/sanity"
import { getClient } from "@lib/sanity.server"
import { groq } from "next-sanity"
import React from "react"
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
          <Flex
            pt="3rem"
            pb="1rem"
            direction={{ base: "column", lg: "row" }}
            align={{ base: "flex-start", lg: "center" }}
          >
            <Heading
              py="1rem"
              mr={{ base: 0, lg: "2rem" }}
              textTransform="uppercase"
            >
              Meet the Creators
            </Heading>
            <InputGroup
              h="max-content"
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
          >
            {creatorResults.map((creator, i) => {
              const { name, slug, creatorPreview, image } = creator

              return (
                <CodeBlockCard
                  key={i}
                  href={`/creators/${slug}`}
                  componentName="Creator"
                  image={image?.url}
                  placeholder={image?.metadata?.lqip}
                  creatorName={name}
                  creatorBio={creatorPreview}
                  borderRadius={10}
                  h={{ base: "auto", md: "100%" }}
                />
              )
            })}
          </Grid>
        </Container>
      </Layout>
    </>
  )
}
const creatorsQuery = groq`*[_type == "creator"] | order(name) {
    _id,
    name,
    creatorPreview,
    "slug": slug.current,
    "image": image.asset->,
    socials,
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
