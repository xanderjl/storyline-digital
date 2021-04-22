export default {
  name: "aboutPage",
  title: "About",
  type: "document",
  fields: [
    {
      name: "body",
      title: "Body",
      type: "blockContent",
    },
  ],
  preview: { select: { title: "title" } },
}
