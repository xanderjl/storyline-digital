import Link from "../NextLink"
import { Flex } from "@chakra-ui/layout"

const NavbarLinks = ({ routes, isOpen }) => {
  return (
    <Flex
      display={{ base: isOpen ? "flex" : "none", md: "flex" }}
      direction={{ base: "column", md: "row" }}
    >
      {routes &&
        routes.map((route, i) => {
          const { title, slug } = route
          return (
            <Link
              key={i}
              href={slug}
              p="1.25rem"
              fontSize="lg"
              _hover={{ bg: "gray.50" }}
            >
              {title}
            </Link>
          )
        })}
    </Flex>
  )
}

export default NavbarLinks
