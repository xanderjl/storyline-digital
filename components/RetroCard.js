import { Heading, VStack } from "@chakra-ui/layout"

const RetroCard = ({ title, children, ...rest }) => {
  return (
    <VStack
      role="group"
      position="relative"
      spacing={4}
      p="1.75rem"
      bg="beige.50"
      boxShadow="lg"
      bg="warmGray.50"
      border="4px solid"
      borderColor="auburn.800"
      borderRadius={10}
      _hover={{
        borderColor: "auburn.400",
      }}
      {...rest}
    >
      {title && (
        <Heading
          m="0 auto"
          maxW="80%"
          size="md"
          position="absolute"
          top={0}
          transform="translateY(-50%)"
          textTransform="uppercase"
          textAlign="center"
          p={{ base: "0.5rem 0.5rem 0 0.5rem", md: "0.5rem 1.5rem 0 1.5rem" }}
          color="primary.700"
          bg="warmGray.50"
          border="4px solid"
          borderColor="auburn.800"
          borderRadius={14}
          zIndex={2}
          _groupHover={{
            borderColor: "auburn.400",
          }}
        >
          {title}
        </Heading>
      )}
      {children}
    </VStack>
  )
}

export default RetroCard
