import { Link as NLink } from "next/link"
import { Link as ChLink } from "@chakra-ui/react"

const Link = ({ href, children, ...rest }) => {
  return (
    <ChLink as={NLink} href={href ? href : "/"} {...rest}>
      {children}
    </ChLink>
  )
}

export default Link
