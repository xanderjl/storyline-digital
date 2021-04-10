import { Link as NLink } from "next/link"
import { Link } from "@chakra-ui/react"

const NextLink = ({ href, children, ...rest }) => {
  return (
    <Link as={NLink} href={href ? href : "/"} {...rest}>
      {children}
    </Link>
  )
}

export default NextLink
