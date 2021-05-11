import { extendTheme } from "@chakra-ui/react"
import styles from "./styles"
import fonts from "./fonts"
import colors from "./colors"
import Link from "./components/Link"
import Button from "./components/Button"

const theme = extendTheme({
  styles,
  components: {
    Link,
    Button,
  },
  fonts,
  colors,
})

export default theme
