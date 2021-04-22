import { BsPersonFill } from "react-icons/bs"

export default {
  name: "creator",
  title: "Creator",
  icon: BsPersonFill,
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
    },
    {
      name: "pronouns",
      title: "Pronouns",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "He/Him", value: "he/him" },
          { title: "She/Her", value: "she/her" },
          { title: "They/Them", value: "they/them" },
          { title: "Other", value: "other" },
        ],
      },
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "bio",
      title: "Bio",
      type: "array",
      of: [
        {
          title: "Block",
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
        },
      ],
    },
    {
      name: "socials",
      title: "Socials",
      type: "socials",
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
}
