import { Flex } from "@chakra-ui/react"

const Card = ({ children, ...rest }) => {
  return (
    <Flex
      direction="column"
      align="center"
      p="1.75rem"
      bg="beige.50"
      boxShadow="sm"
      border="1px solid"
      borderColor="brown.900"
      {...rest}
    >
      {children}
    </Flex>
  )
}

export default Card
