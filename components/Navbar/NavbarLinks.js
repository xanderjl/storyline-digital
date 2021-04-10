import NextLink from "../NextLink"
import { Flex } from "@chakra-ui/layout"

const NavbarLinks = ({ routes }) => {
  return (
    <Flex>
      {routes &&
        routes.map((route, i) => {
          const { title, slug } = route
          return (
            <NextLink
              key={i}
              href={slug}
              p="1.25rem"
              fontSize="lg"
              _hover={{ bg: "gray.50" }}
            >
              {title}
            </NextLink>
          )
        })}
    </Flex>
  )
}

export default NavbarLinks
