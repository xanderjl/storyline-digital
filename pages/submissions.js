import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input } from "@chakra-ui/input"
import { Box, VStack } from "@chakra-ui/layout"
import Layout from "@components/Layout"

const Submissions = () => {
  return (
    <Layout>
      <Box as="form">
        <VStack>
          <FormControl>
            <FormLabel></FormLabel>
            <Input />
          </FormControl>
        </VStack>
      </Box>
    </Layout>
  )
}

export default Submissions
