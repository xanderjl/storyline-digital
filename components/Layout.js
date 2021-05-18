import { Box, Flex } from "@chakra-ui/layout"
import Footer from "./Footer"
import Navbar from "./Navbar"

const Layout = ({ children }) => {
  return (
    <Flex direction="column" w="100%" minH="100vh">
      <Navbar position="fixed" w="100%" zIndex={10} />
      <Box flex={1} mt={{ base: "56px", md: "67px" }}>
        {children}
      </Box>
      <Footer />
    </Flex>
  )
}

export default Layout
