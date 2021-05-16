import { NextSeo } from "next-seo"
import React from "react"

const SEO = ({ ogImageURL, description }) => {
  return (
    <NextSeo
      description={description}
      openGraph={{
        description,
        images: [
          {
            width: 1200,
            height: 636,
            url: ogImageURL,
            alt: "Storyline.Digital",
          },
        ],
      }}
    />
  )
}

export default SEO
