import { Container, Flex } from "@chakra-ui/layout"
import Navbar from "./Navbar"

const Layout = ({ children }) => {
  return (
    <Flex direction="column" w="100%" minH="100vh">
      {/* <Navbar /> */}
      <Container flex={1} maxW="container.xl">
        {children}
      </Container>
    </Flex>
  )
}

export default Layout
