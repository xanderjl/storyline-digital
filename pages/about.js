import { useRouter } from "next/router"
import { groq } from "next-sanity"
import { getClient, usePreviewSubscription, PortableText } from "@lib/sanity"
import { Box, Container, Heading } from "@chakra-ui/layout"
import Layout from "@components/Layout"
import Textfit from "react-textfit"
import Logo from "@components/Logo"

const About = ({ aboutBody, preview }) => {
  const router = useRouter()

  const { data: bod = {} } = usePreviewSubscription(aboutBodyQuery, {
    initialData: aboutBody,
    enabled: preview || router.query.preview !== null,
  })

  const { body } = bod

  return (
    <Layout>
      <Container
        minH="calc(100vh - 57px)"
        p="3rem 1.25rem"
        maxW="container.lg"
        bg="white"
        boxShadow="md"
      >
        <Heading
          flex={1}
          textTransform="uppercase"
          pt="1rem"
          color="analogous.700"
          borderTop="4px solid"
          borderBottom="4px solid"
          borderColor="analogous.700"
        >
          <Textfit mode="single">Storyline.Digital</Textfit>
        </Heading>
        <Container
          display="flex"
          justifyContent="center"
          mt="1rem"
          position="relative"
          overflow="hidden"
          maxW="container.lg"
          minH="calc((100vh - 57px) - 18rem)"
          borderLeft="4px solid"
          borderRight="4px solid"
          borderBottom="4px solid"
          borderColor="analogous.700"
          _after={{
            content: "''",
            display: "block",
            position: "absolute",
            bottom: 0,
            right: 0,
            w: 140,
            h: 140,
            bg: "analogous.700",
            transform: "translate(70px, 70px) rotate(45deg)",
          }}
        >
          <Box p="10rem 1.25rem" maxW="70ch">
            <PortableText blocks={body} />
          </Box>
          <Logo
            position="absolute"
            bottom={0}
            right={0}
            zIndex={2}
            color="warmGray.900"
            mr="6px"
            mb="8px"
          />
        </Container>
      </Container>
    </Layout>
  )
}

const aboutBodyQuery = groq`*[_type == "aboutPage"][0]`

export const getStaticProps = async () => {
  const aboutBody = await getClient().fetch(aboutBodyQuery)

  return { props: { aboutBody } }
}

export default About
