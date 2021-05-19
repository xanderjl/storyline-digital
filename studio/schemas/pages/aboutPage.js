export default {
  name: "aboutPage",
  title: "About",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "tagline",
      title: "Tagline",
      type: "text",
      rows: 5,
    },
    {
      name: "image",
      title: "Background Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "glyphs",
      title: "Glyphs",
      type: "image",
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent",
    },
  ],
  preview: { select: { title: "title" } },
}
