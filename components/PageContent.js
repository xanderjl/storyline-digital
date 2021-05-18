import { Container, Heading } from "@chakra-ui/layout"
import Logo from "./Logo"

const PageContent = ({ children, ...rest }) => {
  return (
    <Container p={{ base: "1.25rem", md: "3rem" }} maxW="container.lg">
      <Container
        p="3rem 1.25rem 8rem 1.25rem"
        display="flex"
        flexDirection="column"
        position="relative"
        overflow="hidden"
        maxW="container.lg"
        minH="calc((100vh - 57px) - 18rem)"
        border="4px solid"
        borderColor="auburn.800"
        borderRadius={14}
        _after={{
          content: "''",
          display: "block",
          position: "absolute",
          bottom: 0,
          right: 0,
          w: 140,
          h: 140,
          bg: "auburn.800",
          transform: "translate(70px, 70px) rotate(45deg)",
        }}
        boxShadow="lg"
        {...rest}
      >
        {children}
        <Logo
          position="absolute"
          bottom={0}
          right={0}
          zIndex={2}
          color="warmGray.900"
          mr="6px"
          mb="8px"
        />
      </Container>
    </Container>
  )
}

export default PageContent
