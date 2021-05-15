import { Image } from "@chakra-ui/image"
import { Box, Text } from "@chakra-ui/layout"
import { useTheme } from "@chakra-ui/system"
import Link from "@components/NextLink"
import { urlFor } from "@lib/sanity"
import Card from "./Card"

const CodeBlockCard = ({ image, placeholder, slug, title, creator, date }) => {
  const theme = useTheme()

  return (
    <Card
      role="group"
      p={0}
      direction={{ base: "column", md: "row" }}
      justifyContent="center"
      alignItems="stretch"
      color="complementary.100"
      bg="black"
      _hover={{ bg: "warmGray.900" }}
    >
      <Link
        href={`/posts/${slug}`}
        maxW={{ base: "100%", md: "40%" }}
        bgColor="warmGray.50"
      >
        <Image
          objectFit="cover"
          h={{ base: "300px", md: "100%" }}
          w="100%"
          objectFit="cover"
          bgImage={`url(${placeholder})`}
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
          href={`/posts/${slug}`}
          mb="1rem"
          fontFamily="mono"
          color="complementary.200"
          _groupHover={{ color: "complementary.100" }}
        >
          <Box as="span" fontWeight={600}>{`<Entry`}</Box>
          <Box
            pl="1rem"
            borderLeft="1px solid"
            borderColor={`${theme.colors.complementary[50]}40`}
          >
            <Text size="md" color="primary.100">
              title=
              <Box as="span" color="white">
                "{title}"
              </Box>
            </Text>
            <Text as="h2" size="md" color="primary.100">
              name=
              <Box as="span" color="white">
                "{creator?.name}"
              </Box>
            </Text>
            <Text color="primary.100">
              date=
              <Box as="span" color="white">
                "{new Date(date).toLocaleDateString("en-CA")}"
              </Box>
            </Text>
          </Box>
          <Box as="span" fontWeight={600}>{` />`}</Box>
        </Link>
      </Box>
    </Card>
  )
}

export default CodeBlockCard
