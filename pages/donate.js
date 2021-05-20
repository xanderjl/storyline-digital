import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { groq } from "next-sanity"
import { usePreviewSubscription, PortableText, urlFor } from "@lib/sanity"
import { getClient } from "@lib/sanity.server"
import {
  Button,
  Grid,
  Heading,
  NumberInput,
  NumberInputField,
  Box,
  VStack,
  Image,
  InputLeftElement,
  InputLeftAddon,
} from "@chakra-ui/react"
import Layout from "@components/Layout"
import PageContent from "@components/PageContent"
import Card from "@components/Cards/Card"
import SEO from "@components/SEO"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY
)

const Donate = ({ siteSettings, donateBody, preview }) => {
  const format = val => `$` + val
  const parse = val => val.replace(/^\$/, "")

  const { data: donate = {} } = usePreviewSubscription(donateQuery, {
    initialData: donateBody,
    enabled: preview,
  })

  const { title, body, illustration, pricingTiers, customCard } = donate

  const [customPrice, setCustomPrice] = useState(customCard.placeholder)

  const stripeHandler = async (name, unit_amount) => {
    const { sessionId } = await fetch("/api/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        line_items: [
          {
            price_data: {
              currency: "cad",
              product_data: {
                name,
              },
              unit_amount,
            },
            quantity: 1,
          },
        ],
      }),
    }).then(res => res.json())
    const stripe = await stripePromise
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    })
  }

  return (
    <>
      <SEO
        description={siteSettings.metaDescription}
        ogImageURL={urlFor(siteSettings.ogImage.asset)}
      />
      <Layout>
        <PageContent p={0}>
          <Box p="3rem 1.25rem">
            <Heading
              size="2xl"
              px={{ base: 0, md: "1rem" }}
              pb="2rem"
              textTransform="uppercase"
            >
              {title}
            </Heading>
            {body && (
              <Box maxW="70ch" px={{ base: 0, md: "1rem" }}>
                <PortableText blocks={body} />
              </Box>
            )}
          </Box>
          {illustration && <Image src={illustration?.url} />}
          <Grid
            p="3rem 1.25rem 8rem 1.25rem"
            templateColumns={{
              base: "minmax(0, 1fr)",
              md: "repeat(auto-fill, minmax(250px, 1fr))",
            }}
            gap={10}
            rowGap={14}
          >
            {pricingTiers.map(tier => {
              const { _key, title, price } = tier
              return (
                <Box
                  key={_key}
                  borderRadius={14}
                  border="4px solid"
                  borderColor="auburn.800"
                >
                  <Card
                    minH="18em"
                    alignItems="center"
                    bg="coolGray.900"
                    color="white"
                    _hover={{ bg: "coolGray.800" }}
                    borderRadius="inherit"
                    border="inherit"
                  >
                    <VStack
                      flex={1}
                      direction="column"
                      align="center"
                      justify="center"
                      textAlign="center"
                      spacing={4}
                    >
                      <Heading>{title}</Heading>
                      <Heading
                        as="h2"
                        fontSize="3xl"
                        fontFamily="body"
                      >{`$${price.toFixed(2)}`}</Heading>
                      <Button onClick={() => stripeHandler(title, price * 100)}>
                        DONATE
                      </Button>
                    </VStack>
                  </Card>
                </Box>
              )
            })}
            <Box borderRadius={14} border="4px solid" borderColor="auburn.800">
              <Card
                h="calc(100% - 5px)"
                m="2px"
                bg="coolGray.900"
                color="white"
                _hover={{ bg: "coolGray.800" }}
                borderRadius={14}
              >
                <VStack
                  flex={1}
                  direction="column"
                  align="center"
                  justify="center"
                  spacing={4}
                  textAlign="center"
                >
                  <Heading>{customCard.title}</Heading>
                  <NumberInput
                    w="8ch"
                    variant="flushed"
                    precision={2}
                    fontSize="3xl"
                    value={format(customPrice)}
                    onChange={e => setCustomPrice(parse(e))}
                  >
                    <NumberInputField
                      p="0"
                      textAlign="center"
                      fontSize="inherit"
                      fontWeight={600}
                    />
                  </NumberInput>
                  <Button
                    onClick={() =>
                      stripeHandler(
                        "Custom Donation Amount",
                        parseFloat(customPrice) * 100
                      )
                    }
                  >
                    DONATE
                  </Button>
                </VStack>
              </Card>
            </Box>
          </Grid>
        </PageContent>
      </Layout>
    </>
  )
}

const donateQuery = groq`*[_type == "donatePage"]{
  title,
  body,
  "illustration": illustration.asset->,
  pricingTiers,
  customCard
}[0]`

export const getStaticProps = async () => {
  const siteSettings = await getClient().fetch(groq`*[_type == "siteSettings"]{
    metaDescription,
    ogImage
  }[0]`)
  const donateBody = await getClient().fetch(donateQuery)

  return { props: { siteSettings, donateBody } }
}

export default Donate
