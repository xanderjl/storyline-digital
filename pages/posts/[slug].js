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
import Textfit from "react-textfit/lib/Textfit"
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

  const { title, creator, categories, publishedAt, body } = post

  return (
    <Layout>
      <PageContent>
        <Heading
          flex={1}
          textTransform="uppercase"
          textAlign="center"
          pt="1rem"
          mb="1rem"
          color="analogous.600"
          borderTop="4px solid"
          borderBottom="4px solid"
          borderColor="analogous.600"
        >
          <Textfit mode="single">{title}</Textfit>
        </Heading>
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
                  color="analogous.600"
                >
                  By {creator?.name}
                </Heading>
              )}
            </Box>
            {publishedAt && (
              <Text>{new Date(publishedAt).toLocaleDateString("en-CA")}</Text>
            )}
            <HStack spacing={2}>
              {categories?.length > 0 &&
                categories.map((category, i) => (
                  <Tag key={i} colorScheme="complementary" size="sm">
                    {category.title}
                  </Tag>
                ))}
            </HStack>
            <Tooltip
              label={hasCopied ? "copied!" : "click to copy"}
              bg="analogous.600"
            >
              <Text
                as="button"
                role="group"
                onClick={onCopy}
                _hover={{ color: "analogous.600" }}
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
              <Heading textTransform="uppercase">{creator?.name}</Heading>
            </Link>
            <SocialIcons socials={creator?.socials} />
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
