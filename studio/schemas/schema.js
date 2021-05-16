import createSchema from "part:@sanity/base/schema-creator"
import schemaTypes from "all:part:@sanity/base/schema-type"

import blockContent from "./blockContent"
import post from "./post"
import creator from "./creator"
import socials from "./creator/socials"
import youtube from "./blockContent/youtube"
import soundcloud from "./blockContent/soundcloud"
import aboutPage from "./pages/aboutPage"
import donatePage from "./pages/donatePage"
import pricingTier from "./pricingTier"
import siteSettings from "./siteSettings"

export default createSchema({
  name: "default",
  types: schemaTypes.concat([
    siteSettings,
    aboutPage,
    donatePage,
    post,
    creator,
    socials,
    blockContent,
    youtube,
    soundcloud,
    pricingTier,
  ]),
})
