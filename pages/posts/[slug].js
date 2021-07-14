import { useRouter } from "next/router"
import Error from "next/error"
import {
  Box,
  Heading,
  Icon,
  Text,
  VStack,
  useClipboard,
  Tooltip,
  Stack,
} from "@chakra-ui/react"
import Layout from "@components/Layout"
import Link from "@components/NextLink"
import SocialIcons from "@components/SocialIcons"
import { usePreviewSubscription, PortableText, urlFor } from "@lib/sanity"
import { getClient } from "@lib/sanity.server"
import { groq } from "next-sanity"
import { FaShareAlt } from "react-icons/fa"
import PageContent from "@components/PageContent"
import SEO from "@components/SEO"

const Post = ({ data = {}, preview }) => {
  const router = useRouter()
  const shareLink = `${process.env.NEXT_PUBLIC_SITE_URL || "localhost:3000"}${
    router.asPath
  }`
  const { hasCopied, onCopy } = useClipboard(shareLink)

  if (!data?.slug) {
    return <Error statusCode={404} />
  }

  const slug = data?.slug
  const { data: post } = usePreviewSubscription(singlePostQuery, {
    params: { slug },
    initialData: data,
    enabled: preview && slug,
  })

  const { metaDescription, ogImage, title, creator, publishedAt, body } = post

  return (
    <>
      <SEO description={metaDescription} ogImageURL={urlFor(ogImage.asset)} />
      <Layout>
        <PageContent>
          <VStack
            align="flex-start"
            textAlign={{ base: "center", md: "left" }}
            spacing={6}
          >
            <Heading size="2xl" textTransform="uppercase">
              {title}
            </Heading>
            <Stack
              direction={{ base: "column", md: "row" }}
              w="100%"
              align={{ base: "center", md: "flex-start" }}
              justify="space-between"
              spacing={6}
            >
              <VStack align={{ base: "center", md: "flex-start" }} spacing={0}>
                {creator && (
                  <>
                    <Heading size="lg" mb="1rem" textTransform="uppercase">
                      By{" "}
                      <Link href={`/creators/${creator?.slug}`}>
                        {creator?.name}
                      </Link>
                    </Heading>
                    <SocialIcons socials={creator?.socials} />
                  </>
                )}
              </VStack>
              <VStack align={{ base: "center", md: "flex-end" }} spacing={0}>
                {publishedAt && (
                  <Text fontFamily="mono">
                    Published:{" "}
                    {new Date(publishedAt).toLocaleDateString("en-CA")}
                  </Text>
                )}
                <Tooltip
                  label={hasCopied ? "copied!" : "click to copy"}
                  bg="complementary.400"
                >
                  <Text
                    as="button"
                    fontFamily="mono"
                    role="group"
                    onClick={onCopy}
                    _hover={{ color: "complementary.400" }}
                  >
                    Share <Icon as={FaShareAlt} />
                  </Text>
                </Tooltip>
              </VStack>
            </Stack>
            <Box flex={1} w="100%">
              <PortableText blocks={body} />
            </Box>
          </VStack>
        </PageContent>
      </Layout>
    </>
  )
}

const postsQuery = groq`*[_type == "post"] { "slug": slug.current }`

const singlePostQuery = groq`
    *[_type == "post" && slug.current == $slug] {
      title,
      "slug": slug.current,
      creator->{
        name,
        "slug": slug.current,
        image,
        pronouns,
        socials,
        bio
      },
      categories[]->{title},
      publishedAt,
      body,
    }[0]
  `

export const getStaticPaths = async () => {
  const posts = await getClient().fetch(postsQuery)
  const paths = posts.map(post => ({
    params: { slug: post.slug },
  }))

  // TODO: troubleshoot the fallback not working in production

  return { paths, fallback: true }
}

export const getStaticProps = async ({ params, preview = false }) => {
  const siteSettings = await getClient().fetch(groq`*[_type == "siteSettings"]{
    metaDescription,
    ogImage
  }[0]`)
  const postData = await getClient(preview).fetch(singlePostQuery, {
    slug: params.slug,
  })

  return { props: { data: { ...siteSettings, ...postData }, preview } }
}

export default Post
