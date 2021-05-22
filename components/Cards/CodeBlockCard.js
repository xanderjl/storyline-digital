import { memo } from "react"
import { Image } from "@chakra-ui/image"
import { Box, Flex, Text } from "@chakra-ui/layout"
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
  creatorBio,
  date,
  ...rest
}) => {
  const theme = useTheme()

  return (
    <Box p="2px" border="4px solid" borderColor="auburn.800" borderRadius={12}>
      <Link href={href} bgColor="warmGray.50">
        <Card
          role="group"
          p={0}
          direction={{ base: "column", md: "row" }}
          justifyContent="center"
          alignItems="stretch"
          color="complementary.400"
          bg="coolGray.900"
          _hover={{ bg: "warmGray.900", color: "complementary.100" }}
          boxShadow="md"
          {...rest}
        >
          <Image
            objectFit="cover"
            maxH={{ base: "auto", md: "250px" }}
            h={{ base: "300px", md: "auto" }}
            w="100%"
            maxW={{ base: "100%", md: "40%" }}
            objectFit="cover"
            bgImage={`url(${placeholder})`}
            bgRepeat="no-repeat"
            bgPosition="center"
            bgSize="cover"
            src={urlFor(image)}
            _groupHover={{ opacity: 0.8 }}
          />
          <Box flex={1} p="2rem" m="auto">
            <Box
              as="span"
              fontWeight={600}
              mb="1rem"
              fontFamily="mono"
            >{`<${componentName}`}</Box>
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
              {creatorBio && (
                <Text as="h2" size="md" color="primary.100">
                  bio=
                  <Box as="span" color="white">
                    "{creatorBio}"
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
          </Box>
        </Card>
      </Link>
    </Box>
  )
}

export default memo(CodeBlockCard)
