import { useRouter } from "next/router"
import Error from "next/error"
import {
  Avatar,
  Box,
  Container,
  Heading,
  Icon,
  StackDivider,
  Text,
  VStack,
  useClipboard,
  Tooltip,
} from "@chakra-ui/react"
import Layout from "@components/Layout"
import Link from "@components/NextLink"
import SocialIcons from "@components/SocialIcons"
import { getClient, usePreviewSubscription, PortableText } from "@lib/sanity"
import { urlFor } from "@lib/sanity"
import { groq } from "next-sanity"
import { FaShareAlt } from "react-icons/fa"

const Post = ({ postData, preview }) => {
  const router = useRouter()
  if (!router.isFallback && !postData?.slug) {
    return <Error statusCode={404} />
  }
  const shareLink = `${process.env.NEXT_PUBLIC_SITE_URL || "localhost:3000"}${
    router.asPath
  }`
  const { hasCopied, onCopy } = useClipboard(shareLink)

  const { data: post = {} } = usePreviewSubscription(singlePostQuery, {
    params: { slug: postData?.slug },
    initialData: postData,
    enabled: preview || router.query.preview !== null,
  })

  const { title, artist, categories, publishedAt, body } = post

  return (
    <Layout>
      <Box p="3rem 1.25rem">
        <Container maxW="container.md">
          <VStack
            align="flex-start"
            spacing={6}
            divider={<StackDivider borderColor="gray.500" />}
          >
            <VStack align="flex-start" spacing={1}>
              <Heading size="2xl">{title}</Heading>
              <Heading size="lg">By {artist?.name}</Heading>
              <Text>{new Date(publishedAt).toLocaleDateString("en-US")}</Text>
              <Tooltip
                label={hasCopied ? "copied!" : "click to copy"}
                bg="gray.500"
              >
                <Text
                  as="button"
                  role="group"
                  onClick={onCopy}
                  _hover={{ color: "gray.600" }}
                >
                  Share <Icon as={FaShareAlt} />
                </Text>
              </Tooltip>
            </VStack>
            <PortableText blocks={body} />
            <VStack align="flex-start">
              <Link
                href={`/artists/${artist?.slug}`}
                display="flex"
                alignItems="center"
              >
                <Avatar
                  size="lg"
                  src={urlFor(artist?.image?.asset)}
                  mr="1rem"
                />
                <Heading>{artist?.name}</Heading>
              </Link>
              <SocialIcons socials={artist?.socials} />
              <PortableText blocks={artist?.bio} />
            </VStack>
          </VStack>
        </Container>
      </Box>
    </Layout>
  )
}

const postsQuery = groq`*[_type == "post"] { "slug": slug.current }`

const singlePostQuery = groq`
    *[_type == "post" && slug.current == $slug] {
      title,
      "slug": slug.current,
      artist->{
        name,
        "slug": slug.current,
        image,
        pronouns,
        socials,
        bio
      },
      categories,
      publishedAt,
      body,
    }[0]
  `

export const getStaticPaths = async () => {
  const posts = await getClient().fetch(postsQuery)
  const paths = posts.map(post => ({
    params: { slug: post.slug },
  }))

  return { paths, fallback: true }
}

export const getStaticProps = async ({ params, preview = false }) => {
  const postData = await getClient(preview).fetch(singlePostQuery, {
    slug: params.slug,
  })

  return { props: { postData, preview } }
}

export default Post
