import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
} from "@chakra-ui/react"

const DateSlider = ({ posts, targetPost, onChange }) => {
  return (
    <VStack spacing={6}>
      <Text>
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
          value={posts.indexOf(targetPost)}
          onChange={onChange}
        >
          <SliderTrack bg="complementary.400">
            <SliderFilledTrack bg="complementary.50" />
          </SliderTrack>
          <SliderThumb w={2} h="max-content" bg="complementary.400">
            <Box position="relative" left="60px">
              <Text>{`${posts.indexOf(targetPost) + 1} / ${
                posts.length
              }`}</Text>
              <Text whiteSpace="nowrap" fontWeight={600}>
                {new Date(targetPost.publishedAt).toLocaleDateString("en-CA")}
              </Text>
            </Box>
          </SliderThumb>
        </Slider>
      </Box>
      <Text>{new Date(posts[0]?.publishedAt).toLocaleDateString("en-CA")}</Text>
    </VStack>
  )
}

export default DateSlider
