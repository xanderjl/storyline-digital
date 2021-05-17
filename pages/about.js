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

const About = ({ data, preview }) => {
  const router = useRouter()

  const { data: bod = {} } = usePreviewSubscription(aboutBodyQuery, {
    initialData: data,
    enabled: preview || router.query.preview !== null,
  })

  const { metaDescription, ogImage, title, image, body } = bod

  return (
    <>
      <SEO description={metaDescription} ogImageURL={urlFor(ogImage.asset)} />
      <Layout>
        <Box
          position="absolute"
          w="100%"
          h="100%"
          bgImage={`url(${image?.metadata?.lqip})`}
          bgRepeat="no-repeat"
          bgSize="cover"
          bgPosition="center"
          zIndex={-1}
        >
          <Box
            position="absolute"
            w="100%"
            h="100%"
            bgImage={`url(${urlFor(image?.url)})`}
            bgRepeat="no-repeat"
            bgSize="cover"
            bgPosition="center"
            zIndex={-1}
          />
        </Box>
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

const aboutBodyQuery = groq`*[_type == "aboutPage"]{
  title,
  "image": image.asset->,
  body,
}[0]`

export const getStaticProps = async () => {
  const siteSettings = await getClient().fetch(groq`*[_type == "siteSettings"]{
    metaDescription,
    ogImage
  }[0]`)
  const aboutBody = await getClient().fetch(aboutBodyQuery)

  return { props: { data: { ...siteSettings, ...aboutBody } } }
}

export default About
