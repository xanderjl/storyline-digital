import createSchema from "part:@sanity/base/schema-creator"
import schemaTypes from "all:part:@sanity/base/schema-type"

import blockContent from "./blockContent"
import category from "./category"
import post from "./post"
import creator from "./creator"
import socials from "./creator/socials"
import youtube from "./blockContent/youtube"
import soundcloud from "./blockContent/soundcloud"
import aboutPage from "./pages/aboutPage"

export default createSchema({
  name: "default",
  types: schemaTypes.concat([
    aboutPage,
    post,
    creator,
    socials,
    category,
    blockContent,
    youtube,
    soundcloud,
  ]),
})
