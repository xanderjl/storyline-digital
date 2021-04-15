import { Icon } from "@chakra-ui/react"
import { FiMenu } from "react-icons/fi"
import { GrClose } from "react-icons/gr"

const ToggleButton = ({ isOpen, clickHandler }) => {
  return (
    <Icon
      m="1.25rem"
      display={{ base: "inline-block", md: "none" }}
      size="lg"
      as={isOpen ? GrClose : FiMenu}
      onClick={clickHandler}
    />
  )
}

export default ToggleButton
