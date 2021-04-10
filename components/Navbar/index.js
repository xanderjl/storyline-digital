import { Box, Container, Flex } from "@chakra-ui/layout"
import NavbarLinks from "./NavbarLinks"
import navRoutes from "@lib/navRoutes"

const Navbar = () => {
  return (
    <Box boxShadow="md">
      <Container maxW="container.xl">
        <Flex justifyContent="space-between">
          <Flex></Flex>
          <NavbarLinks routes={navRoutes} />
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
