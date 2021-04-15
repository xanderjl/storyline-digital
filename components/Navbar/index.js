import { Box, Container, Flex } from "@chakra-ui/layout"
import NavbarLinks from "./NavbarLinks"
import navRoutes from "@lib/navRoutes"
import Icon from "@chakra-ui/icon"

const Navbar = () => {
  return (
    <Box boxShadow="md">
      <Container maxW="container.xl">
        <Flex justifyContent="space-between" alignItems="center">
          <Icon as="/logo.svg" boxSize={10} />
          <NavbarLinks routes={navRoutes} />
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
