import React from "react"
import { MediaEditor } from "sanity-plugin-asset-source-ogimage"
import { BsPencilSquare } from "react-icons/bs"
import { RiPaletteFill } from "react-icons/ri"
import OgImageEditor from "../src/components/OgImageEditor"

export default {
  name: "post",
  title: "Post",
  icon: BsPencilSquare,
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "metaDescription",
      title: "SEO Description",
      description:
        "Keep your description short- ~150characters. It's what will appear in social media share cards!",
      type: "text",
      rows: 4,
    },
    {
      name: "ogImage",
      description:
        "Optional, but highly encouraged for increasing conversion rates for links to this page shared on social media.",
      type: "image",
      options: {
        sources: [
          {
            name: "generate-ogimage",
            title: "Generate share image",
            icon: RiPaletteFill,
            component: props => (
              <MediaEditor {...props} layouts={[OgImageEditor]} />
            ),
          },
        ],
      },
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "creator",
      title: "Creator",
      type: "reference",
      to: { type: "creator" },
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent",
    },
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`,
      })
    },
  },
}
