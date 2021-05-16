export default {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    {
      name: "metaDescription",
      title: "Metadescription",
      description:
        "Important for SEO. It's what shows up when you share site links on social media or when your site shows up in a Google search.",
      type: "text",
      rows: 6,
    },
    {
      name: "ogImage",
      title: "Share Image",
      description: "Your image template should be 1200 x 636 pixels.",
      type: "image",
    },
  ],
}
