import {
  Avatar,
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import Layout from "@components/Layout"
import { getClient, usePreviewSubscription, PortableText } from "@lib/sanity"
import { groq } from "next-sanity"
import { useRouter } from "next/router"
import Error from "next/error"
import Card from "@components/Card"
import Link from "@components/NextLink"
import { urlFor } from "@lib/sanity"
import SocialIcons from "@components/SocialIcons"

const Creators = ({ creatorData, preview }) => {
  const router = useRouter()
  if (!router.isFallback && !creatorData?.slug) {
    return <Error statusCode={404} />
  }

  const { data: creator = {} } = usePreviewSubscription(singleCreatorQuery, {
    params: { slug: creatorData?.slug },
    initialData: creatorData,
    enabled: preview || router.query.preview !== null,
  })

  const { name, slug, bio, image, pronouns, socials, posts } = creator

  return (
    <Layout>
      <Container
        minH="calc(100vh - 62px)"
        maxW="container.lg"
        p="3rem"
        bg="beige.50"
      >
        <VStack spacing={6} align="flex-start">
          <Stack
            direction={{ base: "column", md: "row" }}
            pb="1rem"
            align="center"
            spacing={4}
          >
            <Avatar boxSize={400} src={urlFor(image?.asset)} mr="1.25rem" />
            <VStack maxW="70ch" align="flex-start" spacing={4}>
              <Heading size="4xl">{name}</Heading>
              <Heading size="md">{pronouns}</Heading>
              <SocialIcons socials={socials} />
              <PortableText pb="1rem" blocks={bio} />
            </VStack>
          </Stack>
          <Grid
            w="100%"
            templateColumns={{
              base: "minmax(0, 1fr)",
              md: "repeat(auto-fill, minmax(50ch, 1fr))",
            }}
            gap={8}
          >
            {posts?.map(post => {
              const { _id, title, slug, pushlishedAt, categories } = post
              return (
                <Link key={_id} href={`/posts/${slug}`}>
                  <Card>
                    <Heading>{title}</Heading>
                  </Card>
                </Link>
              )
            })}
          </Grid>
        </VStack>
      </Container>
    </Layout>
  )
}

const creatorsQuery = groq`*[_type == "creator"] { "slug": slug.current }`
const singleCreatorQuery = groq`
  *[_type == "creator" && slug.current == $slug] {
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
  }[0]
`

export const getStaticPaths = async () => {
  const creators = await getClient().fetch(creatorsQuery)
  const paths = creators.map(creator => ({
    params: { slug: creator.slug },
  }))

  return { paths, fallback: true }
}

export const getStaticProps = async ({ params, preview = false }) => {
  const creatorData = await getClient(preview).fetch(singleCreatorQuery, {
    slug: params.slug,
  })

  return { props: { creatorData, preview } }
}

export default Creators
