import { Flex } from "@chakra-ui/react"

const Card = ({ children, ...rest }) => {
  return (
    <Flex
      direction="column"
      align="center"
      p="1.75rem"
      bg="white"
      boxShadow="sm"
      border="1px solid black"
      {...rest}
    >
      {children}
    </Flex>
  )
}

export default Card
