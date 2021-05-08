import { Flex } from "@chakra-ui/react"

const Card = ({ children, ...rest }) => {
  return (
    <Flex
      direction="column"
      align="center"
      p="1.75rem"
      bg="beige.50"
      boxShadow="lg"
      bg="white"
      border="1px solid"
      borderColor="warmGray.300"
      borderRadius={6}
      overflow="hidden"
      _hover={{
        borderColor: "warmGray.500",
      }}
      {...rest}
    >
      {children}
    </Flex>
  )
}

export default Card
