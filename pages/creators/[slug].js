import {
  Avatar,
  Box,
  Container,
  Flex,
  Grid,
  Heading,
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
      <Container maxW="container.xl" p="3rem 1.25rem">
        <VStack spacing={6} align="flex-start">
          <Flex>
            <Avatar size="2xl" src={urlFor(image?.asset)} mr="1.25rem" />
            <Box maxW="70ch">
              <Heading>{name}</Heading>
              <PortableText blocks={bio} />
            </Box>
          </Flex>
          <SocialIcons socials={socials} />
          <Grid
            templateColumns={{
              base: "minmax(0, 1fr)",
              md: "repeat(auto-fill, minmax(40ch, 1fr))",
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
