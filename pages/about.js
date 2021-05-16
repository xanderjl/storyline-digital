import { useRouter } from "next/router"
import { groq } from "next-sanity"
import {
  getClient,
  usePreviewSubscription,
  PortableText,
  urlFor,
} from "@lib/sanity"
import { Box } from "@chakra-ui/layout"
import Layout from "@components/Layout"
import PageContent from "@components/PageContent"
import SEO from "@components/SEO"

const About = ({ siteSettings, aboutBody, preview }) => {
  const router = useRouter()

  const { data: bod = {} } = usePreviewSubscription(aboutBodyQuery, {
    initialData: aboutBody,
    enabled: preview || router.query.preview !== null,
  })

  const { title, body } = bod

  return (
    <>
      <SEO
        description={siteSettings.metaDescription}
        ogImageURL={urlFor(siteSettings.ogImage.asset)}
      />
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
    </>
  )
}

const aboutBodyQuery = groq`*[_type == "aboutPage"][0]`

export const getStaticProps = async () => {
  const siteSettings = await getClient().fetch(groq`*[_type == "siteSettings"]{
    metaDescription,
    ogImage
  }[0]`)
  const aboutBody = await getClient().fetch(aboutBodyQuery)

  return { props: { siteSettings, aboutBody } }
}

export default About
