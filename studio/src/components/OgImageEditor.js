import React from "react"
import { Box, Heading, Image, Text } from "@chakra-ui/react"
import Logo from "../../../components/Logo"

const OgImageEditor = ({ title, subtitle }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      position="relative"
      w="100%"
      h="100%"
      color="warmGray.900"
      p="3rem"
    >
      <Box display="flex" flexDirection="column" maxW="70ch">
        <Heading m={0} mb="1rem" p={0} fontSize="56px" zIndex={2}>
          {title || "Title missing."}
        </Heading>
        {subtitle && (
          <Text m={0} p={0} fontSize="32px" zIndex={2}>
            {subtitle}
          </Text>
        )}
      </Box>
      <Logo
        boxSize={120}
        color="red"
        zIndex={2}
        position="absolute"
        bottom="3rem"
        right="3rem"
      />
      <Image
        src="../static/test-ogimage.jpg"
        w="100%"
        h="100%"
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
      />
    </Box>
  )
}

export default {
  name: "ogImage1200",
  component: OgImageEditor,
  prepare: document => ({
    title: document.title,
    subtitle: document.metaDescription,
  }),
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 4,
    },
  ],
}
