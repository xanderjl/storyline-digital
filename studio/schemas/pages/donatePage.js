export default {
  name: "donatePage",
  title: "Donate Page",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent",
    },
    {
      name: "illustration",
      title: "Illustration",
      type: "image",
    },
    {
      name: "pricingTiers",
      title: "Pricing Tiers",
      type: "array",
      of: [{ type: "pricingTier" }],
    },
    {
      name: "customCard",
      title: "Custom Price Card",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Card Heading",
          type: "string",
        },
        {
          name: "placeholder",
          title: "Placeholder value",
          description: "Keep it in the format of xx.xx",
          type: "string",
        },
      ],
    },
  ],
}
