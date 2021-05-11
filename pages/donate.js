import { useState } from "react"
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
} from "@chakra-ui/react"
import Layout from "@components/Layout"
import PageContent from "@components/PageContent"
import RetroCard from "@components/RetroCard"

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
      <PageContent title={title}>
        {body && (
          <Box
            maxW="70ch"
            m="0 auto"
            p={{ base: "6rem 1rem 3rem 1rem", md: "8rem 1rem 3rem 1rem" }}
          >
            <PortableText blocks={body} />
          </Box>
        )}
        <Grid
          p="2rem 1rem"
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
              <RetroCard key={_key} title={title} minH="18em">
                <Heading fontFamily="body">{`$${price.toFixed(2)}`}</Heading>
                <Button>DONATE</Button>
              </RetroCard>
            )
          })}
          <RetroCard title="Set Your Own Price">
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
            <Button>DONATE</Button>
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
