import { useState } from "react"
import { Box, Container, Flex, Heading } from "@chakra-ui/layout"
import NavbarLinks from "./NavbarLinks"
import navRoutes from "@lib/navRoutes"
import Icon from "@chakra-ui/icon"
import Link from "@components/NextLink"
import ToggleButton from "./ToggleButton"

const Navbar = () => {
  const [isOpen, setOpen] = useState(false)

  return (
    <Box boxShadow="md">
      <Container maxW="container.xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="space-between"
        >
          <Flex justify="space-between" align="center">
            <Link display="flex" alignItems="center">
              <Icon as="/logo.svg" boxSize={10} />
              <Heading pl="0.5rem" size="lg">
                Storyline.Digital
              </Heading>
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
