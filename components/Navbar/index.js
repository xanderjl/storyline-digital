import { useState } from "react"
import { Box, Container, Flex, Heading } from "@chakra-ui/layout"
import NavbarLinks from "./NavbarLinks"
import navRoutes from "@lib/navRoutes"
import Link from "@components/NextLink"
import ToggleButton from "./ToggleButton"
import Logo from "@components/Logo"

const Navbar = props => {
  const [isOpen, setOpen] = useState(false)

  return (
    <Box boxShadow="md" bg="primary.50" {...props}>
      <Container maxW="container.xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="space-between"
        >
          <Flex justify="space-between" align="center">
            <Link display="flex" alignItems="center">
              <Logo color="auburn.800" _hover={{ color: "auburn.600" }} />
            </Link>
            <ToggleButton
              isOpen={isOpen}
              clickHandler={() => setOpen(!isOpen)}
            />
          </Flex>
          <NavbarLinks isOpen={isOpen} routes={navRoutes} />
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
