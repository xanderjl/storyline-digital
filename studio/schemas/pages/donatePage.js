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
  ],
}
