import { useState } from "react"
import { Box, Container, Flex } from "@chakra-ui/layout"
import NavbarLinks from "./NavbarLinks"
import navRoutes from "@lib/navRoutes"
import Link from "@components/NextLink"
import ToggleButton from "./ToggleButton"
import Logo from "@components/Logo"

const Navbar = props => {
  const [isOpen, setOpen] = useState(false)

  return (
    <Box boxShadow="md" bg="coolGray.800" color="white" {...props}>
      <Container maxW="container.xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="space-between"
        >
          <Flex justify="space-between" align="center">
            <Link display="flex" alignItems="center">
              <Logo
                color="auburn.600"
                _hover={{ color: "complementary.400" }}
              />
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
