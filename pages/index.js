import { Box, Heading } from "@chakra-ui/layout"
import Layout from "@components/Layout"

const Home = () => {
  return (
    <Layout>
      <Box p={{ base: "3rem 1.25rem", md: "7rem 1.25rem", xl: "12rem 1.25rem" }}>
        <Heading size="4xl">There Will Be Stories Here Soon.</Heading>
      </Box>
    </Layout>
  )
}

export default Home
