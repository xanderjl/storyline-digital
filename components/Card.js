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
      borderRadius={6}
      overflow="hidden"
      {...rest}
    >
      {children}
    </Flex>
  )
}

export default Card
