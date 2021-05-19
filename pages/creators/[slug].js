import { Box, Grid, Heading, Image, Stack, VStack } from "@chakra-ui/react"
import Layout from "@components/Layout"
import { usePreviewSubscription, PortableText } from "@lib/sanity"
import { getClient } from "@lib/sanity.server"
import { groq } from "next-sanity"
import { useRouter } from "next/router"
import Error from "next/error"
import { urlFor } from "@lib/sanity"
import SocialIcons from "@components/SocialIcons"
import PageContent from "@components/PageContent"
import SEO from "@components/SEO"
import CodeBlockCard from "@components/Cards/CodeBlockCard"

const Creators = ({ data, preview }) => {
  const router = useRouter()
  if (!router.isFallback && !data?.slug) {
    return <Error statusCode={404} />
  }
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const { data: creator } = usePreviewSubscription(singleCreatorQuery, {
    params: { slug: data?.slug },
    initialData: data,
    enabled: preview,
  })

  const { name, bio, image, socials, posts, metaDescription, ogImage } = creator

  return (
    <>
      <SEO description={metaDescription} ogImageURL={urlFor(ogImage?.asset)} />
      <Layout>
        <PageContent>
          <VStack px="1rem" spacing={6} align="center">
            <Stack
              direction={{ base: "column", lg: "row" }}
              pb="2rem"
              align="flex-start"
              spacing={4}
            >
              <Box
                boxSize={{ base: 250, md: 400 }}
                borderRadius="50%"
                bgImage={`url(${image?.metadata?.lqip})`}
                bgRepeat="no-repeat"
                bgPosition="center"
                bgSize="cover"
                mr="1.25rem"
              >
                <Image
                  maxW="initial"
                  boxSize="inherit"
                  borderRadius="inherit"
                  objectFit="cover"
                  src={urlFor(image?.url).width(400).height(400)}
                />
              </Box>
              <VStack maxW="70ch" align="flex-start" spacing={4}>
                <Heading textTransform="uppercase">{name}</Heading>
                <SocialIcons socials={socials} />
                {bio && <PortableText pb="1rem" blocks={bio} />}
              </VStack>
            </Stack>
            <Grid
              maxW="70ch"
              templateColumns={{
                base: "minmax(0, 1fr)",
                md: "repeat(auto-fill, minmax(50ch, 1fr))",
              }}
              gap={8}
            >
              {posts?.map(post => {
                const { _id, title, slug, postImage } = post
                return (
                  <CodeBlockCard
                    componentName="Entry"
                    image={postImage?.url}
                    title={title}
                    href={`/posts/${slug}`}
                  />
                )
              })}
            </Grid>
          </VStack>
        </PageContent>
      </Layout>
    </>
  )
}

const creatorsQuery = groq`*[_type == "creator"] { "slug": slug.current }`
const singleCreatorQuery = groq`
  *[_type == "creator" && slug.current == $slug] {
    _id,
    name,
    "slug": slug.current,
    bio,
    "image": image.asset->,
    socials,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt) {
      _id,
      title,
      "postImage": mainImage.asset->,
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
  const siteSettings = await getClient(preview)
    .fetch(groq`*[_type == "siteSettings"]{
    metaDescription,
    ogImage
  }[0]`)
  const creatorData = await getClient(preview).fetch(singleCreatorQuery, {
    slug: params.slug,
  })

  // console.log({ ...siteSettings, ...creatorData })

  return { props: { data: { ...siteSettings, ...creatorData }, preview } }
}

export default Creators
