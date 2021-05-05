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
  HStack,
  Tag,
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

  const { title, creator, categories, publishedAt, body } = post

  return (
    <Layout>
      <Container
        maxW="container.lg"
        minH="calc(100vh - 62px)"
        p="3rem"
        bg="white"
      >
        <VStack
          align="flex-start"
          spacing={6}
          divider={<StackDivider borderColor="brown.500" />}
        >
          <VStack align="flex-start" spacing={2}>
            <Box>
              <Heading size="2xl">{title}</Heading>
              {creator && <Heading size="lg">By {creator?.name}</Heading>}
            </Box>
            {publishedAt && (
              <Text>{new Date(publishedAt).toLocaleDateString("en-CA")}</Text>
            )}
            <HStack spacing={2}>
              {categories?.length > 0 &&
                categories.map((category, i) => (
                  <Tag key={i} colorScheme="brown" size="sm">
                    {category.title}
                  </Tag>
                ))}
            </HStack>
            <Tooltip
              label={hasCopied ? "copied!" : "click to copy"}
              bg="brown.400"
            >
              <Text
                as="button"
                role="group"
                onClick={onCopy}
                _hover={{ color: "brown.400" }}
              >
                Share <Icon as={FaShareAlt} />
              </Text>
            </Tooltip>
          </VStack>
          <PortableText blocks={body} />
          <VStack align="flex-start">
            <Link
              href={`/artists/${creator?.slug}`}
              display="flex"
              alignItems="center"
            >
              <Avatar size="lg" src={urlFor(creator?.image?.asset)} mr="1rem" />
              <Heading>{creator?.name}</Heading>
            </Link>
            <SocialIcons socials={creator?.socials} />
            <PortableText blocks={creator?.bio} />
          </VStack>
        </VStack>
      </Container>
    </Layout>
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
  const postData = await getClient(preview).fetch(singlePostQuery, {
    slug: params.slug,
  })

  return { props: { postData, preview } }
}

export default Post
