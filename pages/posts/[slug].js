import { Box } from "@chakra-ui/layout"
import Layout from "@components/Layout"
import sanity from "@lib/sanity"
import { groq } from "next-sanity"

const Post = ({ post }) => {
  return (
    <Layout>
      <Box as="pre">{JSON.stringify(post, null, 2)}</Box>
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
  const posts = await sanity.fetch(postsQuery)
  const paths = posts.map(post => ({
    params: { slug: post.slug },
  }))

  return { paths, fallback: false }
}

export const getStaticProps = async ({ params }) => {
  const post = await sanity.fetch(singlePostQuery, { slug: params.slug })

  return { props: { post } }
}

export default Post
