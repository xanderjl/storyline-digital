import { Box, Container, Flex, Stack, Text } from "@chakra-ui/react"
import navRoutes from "@lib/navRoutes"
import Link from "./NextLink"

const Footer = () => {
  return (
    <Container maxW="container.xl">
      <Stack
        direction={{ base: "column", md: "row" }}
        p="3rem 1.25rem"
        spacing={4}
      >
        {navRoutes.map((route, i) => {
          const { title, slug } = route
          return (
            <Link key={i} href={slug} fontSize="xl">
              {title}
            </Link>
          )
        })}
      </Stack>
      <Flex align="center" justify="center">
        <Text>&copy; {new Date().getFullYear()} Storyline.Digital</Text>
      </Flex>
    </Container>
  )
}

export default Footer
