import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { groq } from "next-sanity"
import {
  getClient,
  usePreviewSubscription,
  PortableText,
  urlFor,
} from "@lib/sanity"
import {
  Button,
  Grid,
  Heading,
  NumberInput,
  NumberInputField,
  Box,
  VStack,
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
  const [customPrice, setCustomPrice] = useState("27.50")

  const { data: donate = {} } = usePreviewSubscription(donateQuery, {
    initialData: donateBody,
    enabled: preview,
  })

  const { title, body, pricingTiers } = donate

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
        <PageContent>
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
          <Grid
            p={{ base: "1rem 0", md: "2rem 1rem" }}
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
                <Card
                  key={_key}
                  minH="18em"
                  alignItems="center"
                  bg="coolGray.900"
                  color="white"
                  _hover={{ bg: "coolGray.800" }}
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
              )
            })}
            <Card
              bg="coolGray.900"
              color="white"
              _hover={{ bg: "coolGray.800" }}
            >
              <VStack
                flex={1}
                direction="column"
                align="center"
                justify="center"
                spacing={4}
                textAlign="center"
              >
                <Heading>Custom Amount</Heading>
                <NumberInput
                  variant="unstyled"
                  precision={2}
                  borderColor="analogous.600"
                  fontSize="3xl"
                  value={format(customPrice)}
                  onChange={e => setCustomPrice(parse(e))}
                >
                  <NumberInputField
                    textDecoration="underline"
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
          </Grid>
        </PageContent>
      </Layout>
    </>
  )
}

const donateQuery = groq`*[_type == "donatePage"][0]`

export const getStaticProps = async () => {
  const siteSettings = await getClient().fetch(groq`*[_type == "siteSettings"]{
    metaDescription,
    ogImage
  }[0]`)
  const donateBody = await getClient().fetch(donateQuery)

  return { props: { siteSettings, donateBody } }
}

export default Donate
