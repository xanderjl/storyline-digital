import { useRouter } from "next/router"
import { groq } from "next-sanity"
import { getClient, usePreviewSubscription, PortableText } from "@lib/sanity"
import { Box } from "@chakra-ui/layout"
import Layout from "@components/Layout"
import PageContent from "@components/PageContent"

const About = ({ aboutBody, preview }) => {
  const router = useRouter()

  const { data: bod = {} } = usePreviewSubscription(aboutBodyQuery, {
    initialData: aboutBody,
    enabled: preview || router.query.preview !== null,
  })

  const { title, body } = bod

  return (
    <Layout>
      <PageContent
        title={title}
        alignItems="center"
        p={{ base: "6rem 1.25rem 6rem 1.25rem" }}
      >
        <Box maxW="70ch">
          <PortableText blocks={body} />
        </Box>
      </PageContent>
    </Layout>
  )
}

const aboutBodyQuery = groq`*[_type == "aboutPage"][0]`

export const getStaticProps = async () => {
  const aboutBody = await getClient().fetch(aboutBodyQuery)

  return { props: { aboutBody } }
}

export default About
