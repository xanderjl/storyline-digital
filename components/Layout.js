import { Container, Flex } from "@chakra-ui/layout"
import Navbar from "./Navbar"

const Layout = ({ children }) => {
  return (
    <Flex
      direction="column"
      w="100%"
      minH="100vh"
      bgImage="url('Background.svg')"
      bgRepeat="no-repeat"
      bgSize="60vh"
      bgAttachment="fixed"
      bgPosition="100% 0"
    >
      <Navbar />
      <Container flex={1} maxW="container.xl">
        {children}
      </Container>
    </Flex>
  )
}

export default Layout
