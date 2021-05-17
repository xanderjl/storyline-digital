import { Image } from "@chakra-ui/image"
import { Box, Text } from "@chakra-ui/layout"
import { useTheme } from "@chakra-ui/system"
import Link from "@components/NextLink"
import { urlFor } from "@lib/sanity"
import Card from "./Card"

const CodeBlockCard = ({
  componentName,
  image,
  placeholder,
  href,
  title,
  creatorName,
  date,
  ...rest
}) => {
  const theme = useTheme()

  return (
    <Box p="8px" border="4px solid" borderColor="auburn.800" borderRadius={12}>
      <Card
        role="group"
        p={0}
        direction={{ base: "column", md: "row" }}
        justifyContent="center"
        alignItems="stretch"
        color="complementary.100"
        bg="coolGray.900"
        _hover={{ bg: "warmGray.900" }}
        boxShadow="md"
        {...rest}
      >
        <Link
          href={href}
          maxW={{ base: "100%", md: "40%" }}
          bgColor="warmGray.50"
        >
          <Image
            objectFit="cover"
            h={{ base: "300px", md: "100%" }}
            w="100%"
            objectFit="cover"
            bgImage={`url()`}
            bgRepeat="no-repeat"
            bgPosition="center"
            bgSize="cover"
            src={urlFor(image)}
            fallbackSrc="https://via.placeholder.com/400"
            _groupHover={{ opacity: 0.8 }}
          />
        </Link>
        <Box flex={1} p="2rem">
          <Link
            href={href}
            mb="1rem"
            fontFamily="mono"
            color="complementary.400"
            _groupHover={{ color: "complementary.100" }}
          >
            <Box as="span" fontWeight={600}>{`<`}</Box>
            <Box
              pl="1rem"
              borderLeft="1px solid"
              borderColor={`${theme.colors.complementary[50]}40`}
            >
              {title && (
                <Text size="md" color="primary.100">
                  title=
                  <Box as="span" color="white">
                    "{title}"
                  </Box>
                </Text>
              )}
              {creatorName && (
                <Text as="h2" size="md" color="primary.100">
                  name=
                  <Box as="span" color="white">
                    "{creatorName}"
                  </Box>
                </Text>
              )}
              {date && (
                <Text color="primary.100">
                  date=
                  <Box as="span" color="white">
                    "{new Date(date).toLocaleDateString("en-CA")}"
                  </Box>
                </Text>
              )}
            </Box>
            <Box as="span" fontWeight={600}>{` />`}</Box>
          </Link>
        </Box>
      </Card>
    </Box>
  )
}

export default CodeBlockCard
