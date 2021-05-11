import { useState } from "react"
import { useRouter } from "next/router"
import { groq } from "next-sanity"
import { getClient, usePreviewSubscription, PortableText } from "@lib/sanity"
import {
  Button,
  Container,
  Grid,
  Heading,
  VStack,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  Box,
} from "@chakra-ui/react"
import Layout from "@components/Layout"
import Textfit from "react-textfit/lib/Textfit"

const Donate = ({ donateBody, preview }) => {
  const router = useRouter()
  const format = val => `$` + val
  const parse = val => val.replace(/^\$/, "")
  const [customPrice, setCustomPrice] = useState("27.50")

  const { data: donate = {} } = usePreviewSubscription(donateQuery, {
    initialData: donateBody,
    enabled: preview || router.query.preview !== null,
  })

  const { title, body, pricingTiers } = donate

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
          textAlign="center"
          pt="1rem"
          color="analogous.600"
          borderTop="4px solid"
          borderBottom="4px solid"
          borderColor="analogous.600"
        >
          <Textfit mode="single">{title}</Textfit>
        </Heading>
        {body && (
          <Box py={{ base: "3rem", md: "5rem" }}>
            <PortableText blocks={body} />
          </Box>
        )}
        <Grid
          py="2rem"
          templateColumns={{
            base: "minmax(0, 1fr)",
            md: "repeat(auto-fill, minmax(250px, 1fr))",
          }}
          gap={8}
        >
          {pricingTiers.map(tier => {
            const { _key, title, price } = tier
            return (
              <VStack
                key={_key}
                minH={{ base: "12em", md: "18em" }}
                py="2rem"
                spacing={4}
                borderTop="4px solid"
                borderBottom="4px solid"
                borderColor="analogous.600"
              >
                <Heading textTransform="uppercase" textAlign="center">
                  {title}
                </Heading>
                <Heading fontFamily="body">{`$${price.toFixed(2)}`}</Heading>
                <Button
                  colorScheme="analogous"
                  borderRadius="none"
                  fontFamily="heading"
                >
                  DONATE
                </Button>
              </VStack>
            )
          })}
          <VStack
            minH="18em"
            py="2rem"
            spacing={4}
            borderTop="4px solid"
            borderBottom="4px solid"
            borderColor="analogous.600"
          >
            <Heading textTransform="uppercase" textAlign="center">
              Set Your Own Price
            </Heading>
            <NumberInput
              variant="unstyled"
              precision={2}
              borderColor="analogous.600"
              fontSize="4xl"
              value={format(customPrice)}
              onChange={e => setCustomPrice(parse(e))}
            >
              <NumberInputField
                p="0"
                textAlign="center"
                fontSize="4xl"
                fontWeight={600}
              />
            </NumberInput>
            <Button
              colorScheme="analogous"
              borderRadius="none"
              fontFamily="heading"
            >
              DONATE
            </Button>
          </VStack>
        </Grid>
      </Container>
    </Layout>
  )
}

const donateQuery = groq`*[_type == "donatePage"][0]`

export const getStaticProps = async () => {
  const donateBody = await getClient().fetch(donateQuery)

  return { props: { donateBody } }
}

export default Donate
