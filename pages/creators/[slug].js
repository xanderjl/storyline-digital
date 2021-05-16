import { Box, Grid, Heading, Image, Stack, VStack } from "@chakra-ui/react"
import Layout from "@components/Layout"
import { getClient, usePreviewSubscription, PortableText } from "@lib/sanity"
import { groq } from "next-sanity"
import { useRouter } from "next/router"
import Error from "next/error"
import Card from "@components/Cards/Card"
import Link from "@components/NextLink"
import { urlFor } from "@lib/sanity"
import SocialIcons from "@components/SocialIcons"
import PageContent from "@components/PageContent"
import { NextSeo } from "next-seo"

const Creators = ({ data, preview }) => {
  const router = useRouter()
  if (!router.isFallback && !data?.slug) {
    return <Error statusCode={404} />
  }

  const { data: creator = {} } = usePreviewSubscription(singleCreatorQuery, {
    params: { slug: data?.slug },
    initialData: data,
    enabled: preview || router.query.preview !== null,
  })

  const { name, bio, image, socials, posts, metaDescription, ogImage } = creator

  return (
    <>
      <NextSeo
        openGraph={{
          description: metaDescription,
          images: [
            {
              url: urlFor(ogImage?.asset),
              width: 1200,
              height: 636,
              alt: "Storyline.Digital",
            },
          ],
        }}
      />
      <Layout>
        <PageContent title={name}>
          <VStack px="1rem" spacing={6} align="center">
            <Stack
              direction={{ base: "column", lg: "row" }}
              pb="2rem"
              align="center"
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
                const { _id, title, slug } = post
                return (
                  <Link key={_id} href={`/posts/${slug}`}>
                    <Card
                      role="group"
                      border="4px solid"
                      bg="warmGray.50"
                      borderColor="auburn.800"
                      _hover={{
                        borderColor: "auburn.400",
                      }}
                    >
                      <Heading
                        textAlign="center"
                        _groupHover={{ color: "warmGray.700" }}
                      >
                        {title}
                      </Heading>
                    </Card>
                  </Link>
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

  return { props: { data: { ...siteSettings, ...creatorData }, preview } }
}

export default Creators
