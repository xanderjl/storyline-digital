import { Container, Heading } from "@chakra-ui/layout"
import Logo from "./Logo"

const PageContent = ({ title, children, ...rest }) => {
  return (
    <Container
      minH="calc(100vh - 57px)"
      p={{ base: "0 1.25rem", md: "0 3rem" }}
      maxW="container.lg"
      bg="warmGray.50"
      boxShadow="md"
    >
      {title && (
        <Heading
          size={title.length > 24 ? "xl" : "2xl"}
          w="max-content"
          maxW={{ base: "80%", md: "66%" }}
          m="0 auto"
          position="relative"
          top={0}
          transform="translateY(50%)"
          textTransform="uppercase"
          textAlign="center"
          p={{ base: "0.5rem 1rem 0 1rem", md: "1rem 2rem 0 2rem" }}
          color="primary.700"
          bg="warmGray.50"
          border="4px solid"
          borderColor="auburn.800"
          borderRadius={14}
          boxShadow="md"
          zIndex={2}
        >
          {title}
        </Heading>
      )}
      <Container
        p={{ base: "3rem 1.25rem", md: "6rem 1.25rem" }}
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
