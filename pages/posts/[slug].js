import { useRouter } from "next/router"
import Error from "next/error"
import {
  Avatar,
  Box,
  Heading,
  Icon,
  StackDivider,
  Text,
  VStack,
  useClipboard,
  Tooltip,
  Flex,
} from "@chakra-ui/react"
import Layout from "@components/Layout"
import Link from "@components/NextLink"
import SocialIcons from "@components/SocialIcons"
import { getClient, usePreviewSubscription, PortableText } from "@lib/sanity"
import { urlFor } from "@lib/sanity"
import { groq } from "next-sanity"
import { FaShareAlt } from "react-icons/fa"
import PageContent from "@components/PageContent"

const Post = ({ postData, preview }) => {
  const router = useRouter()
  if (!postData?.slug) {
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

  const { title, creator, publishedAt, body } = post

  return (
    <Layout>
      <PageContent title={title}>
        <VStack
          align="flex-start"
          spacing={6}
          divider={<StackDivider borderColor="brown.500" />}
        >
          <VStack w="100%" align="center" spacing={2}>
            <Box>
              {creator && (
                <Heading
                  size="lg"
                  mb="1rem"
                  textTransform="uppercase"
                  color="primary.700"
                >
                  By {creator?.name}
                </Heading>
              )}
            </Box>
            {publishedAt && (
              <Text>{new Date(publishedAt).toLocaleDateString("en-CA")}</Text>
            )}
            <Tooltip
              label={hasCopied ? "copied!" : "click to copy"}
              bg="complementary.400"
            >
              <Text
                as="button"
                role="group"
                onClick={onCopy}
                _hover={{ color: "complementary.400" }}
              >
                Share <Icon as={FaShareAlt} />
              </Text>
            </Tooltip>
          </VStack>
          <Box flex={1} w="100%">
            <PortableText blocks={body} />
          </Box>
          <VStack align="flex-start">
            <Flex align="center">
              <Link href={`/artists/${creator?.slug}`}>
                <Avatar
                  size="xl"
                  src={urlFor(creator?.image?.asset)}
                  mr="1rem"
                  _hover={{ opacity: 0.8 }}
                />
              </Link>
              <Flex direction="column">
                <Link href={`/artists/${creator?.slug}`}>
                  <Heading textTransform="uppercase">{creator?.name}</Heading>
                </Link>
                <SocialIcons socials={creator?.socials} />
              </Flex>
            </Flex>
            <PortableText blocks={creator?.bio} />
          </VStack>
        </VStack>
      </PageContent>
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
