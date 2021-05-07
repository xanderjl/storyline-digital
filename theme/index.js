import { extendTheme } from "@chakra-ui/react"
import styles from "./styles"
import fonts from "./fonts"
import colors from "./colors"
import Link from "./components/Link"

const theme = extendTheme({
  styles,
  components: {
    Link,
  },
  fonts,
  colors,
})

export default theme
