import { Container, Heading, VStack } from "@chakra-ui/layout"
import Layout from "@components/Layout"

const Donate = () => {
  return (
    <Layout>
      <Container p="3rem 1.25rem" maxW="container.md">
        <VStack>
          <Heading
            size="4xl"
            display="inline-block"
            flex={1}
            textTransform="uppercase"
            p="0.5rem"
            m="0 auto"
            color="analogous.700"
            borderTop="6px solid"
            borderBottom="6px solid"
            borderColor="analogous.700"
          >
            Artist Fund
          </Heading>
        </VStack>
      </Container>
    </Layout>
  )
}

export default Donate
