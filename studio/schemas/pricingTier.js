export default {
  name: "pricingTier",
  title: "Pricing Tier",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "copy",
      title: "Copy",
      description:
        "Not necessary, but an oportunity for explaining what the dono will be used for.",
      type: "text",
      rows: 4,
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
  ],
}
