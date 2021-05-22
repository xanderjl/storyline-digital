import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
} from "@chakra-ui/react"

const DateSlider = ({ posts, targetPost }) => {
  return (
    <VStack spacing={6}>
      <Text fontFamily="mono" whiteSpace="nowrap">
        {new Date(posts[posts?.length - 1]?.publishedAt).toLocaleDateString(
          "en-CA"
        )}
      </Text>
      <Box py="1rem" minH="100%">
        <Slider
          minH="400px"
          orientation="vertical"
          min={0}
          max={posts?.length - 1}
          step={1}
          value={targetPost}
          isReversed
          isDisabled
        >
          <SliderTrack
            bg="complementary.50"
            _disabled={{ bg: "complementary.50" }}
          >
            <SliderFilledTrack
              bg="complementary.500"
              _disabled={{ bg: "complementary.500" }}
            />
          </SliderTrack>
          <SliderThumb
            w={2}
            h="max-content"
            bg="complementary.500"
            _disabled={{ bg: "complementary.500" }}
          >
            <Box
              position="relative"
              left="60px"
              _disabled={{ color: "coolGray.900" }}
            >
              <Text fontFamily="mono">{`${targetPost + 1} / ${
                posts.length
              }`}</Text>
              <Text fontFamily="mono" whiteSpace="nowrap" fontWeight={600}>
                {new Date(posts[targetPost].publishedAt).toLocaleDateString(
                  "en-CA"
                )}
              </Text>
            </Box>
          </SliderThumb>
        </Slider>
      </Box>
      <Text fontFamily="mono" whiteSpace="nowrap">
        {new Date(posts[0]?.publishedAt).toLocaleDateString("en-CA")}
      </Text>
    </VStack>
  )
}

export default DateSlider
