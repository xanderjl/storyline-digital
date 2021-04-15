import { Link as NextLink } from "next/link"
import { Link } from "@chakra-ui/react"
const Link = ({ href, children }) => {
  return (
    <Link as={NextLink} href={href}>
      {children}
    </Link>
  )
}

export default Link
