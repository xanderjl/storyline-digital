import Layout from "@components/Layout"
import sanity from "@lib/sanity"
import groq from "next-sanity"

const Post = () => {
  return <Layout></Layout>
}

const postsQuery = groq`*[_type == "post"] { "slug": slug.current }`

const singlePostQuery = groq`
    *[_type == "post" && slug.current == "test"] {
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
    }
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
