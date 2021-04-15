import { Box, Container, Flex, Heading } from "@chakra-ui/layout"
import NavbarLinks from "./NavbarLinks"
import navRoutes from "@lib/navRoutes"
import Icon from "@chakra-ui/icon"
import Link from "@components/NextLink"

const Navbar = () => {
  return (
    <Box boxShadow="md">
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          <Link display="flex" alignItems="center">
            <Icon as="/logo.svg" boxSize={10} />
            <Heading pl="0.5rem" size="lg">Storyline.Digital</Heading>
          </Link>
          <NavbarLinks routes={navRoutes} />
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
