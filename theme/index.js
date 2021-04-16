import { extendTheme } from "@chakra-ui/react"
import styles from "./styles"
import fonts from "./fonts"
import colors from "./colors"

const theme = extendTheme({
  styles,
  fonts,
  colors,
})

export default theme
