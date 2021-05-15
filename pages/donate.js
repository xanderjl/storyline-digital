import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { useRouter } from "next/router"
import { groq } from "next-sanity"
import { getClient, usePreviewSubscription, PortableText } from "@lib/sanity"
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
import RetroCard from "@components/Cards/RetroCard"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY
)

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
    <Layout>
      <PageContent title={title} p={{ base: "3rem 1.25rem 6rem 1.25rem" }}>
        {body && (
          <Box maxW="70ch" m="0 auto" p={{ base: "3rem 0", md: "3rem 1rem" }}>
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
              <RetroCard
                key={_key}
                title={title}
                minH="18em"
                alignItems="center"
              >
                <VStack
                  flex={1}
                  direction="column"
                  align="center"
                  justify="center"
                  spacing={4}
                >
                  <Heading fontFamily="body">{`$${price.toFixed(2)}`}</Heading>
                  <Button onClick={() => stripeHandler(title, price * 100)}>
                    DONATE
                  </Button>
                </VStack>
              </RetroCard>
            )
          })}
          <RetroCard title="Set Your Own Price">
            <VStack
              flex={1}
              direction="column"
              align="center"
              justify="center"
              spacing={4}
            >
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
          </RetroCard>
        </Grid>
      </PageContent>
    </Layout>
  )
}

const donateQuery = groq`*[_type == "donatePage"][0]`

export const getStaticProps = async () => {
  const donateBody = await getClient().fetch(donateQuery)

  return { props: { donateBody } }
}

export default Donate
