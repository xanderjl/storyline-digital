import { Container } from "@chakra-ui/layout"

const PageContent = ({ children, ...rest }) => {
  return (
    <Container
      minH="calc(100vh - 57px)"
      p={{ base: "3rem 1.25rem", md: "4rem 3rem" }}
      maxW="container.lg"
      bg="white"
      boxShadow="md"
      {...rest}
    >
      {children}
    </Container>
  )
}

export default PageContent
