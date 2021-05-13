const stripe = require("stripe")(process.env.STRIPE_SECRET_API_KEY)

export default async (req, res) => {
  const { line_items } = req.body

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    success_url:
      process.env.STRIPE_SUCCESS_URL || "http://localhost:3000/success",
    cancel_url: process.env.STRIPE_CANCEL_URL || "http://localhost:3000/cancel",
  })

  res.status(200).json({ sessionId: session.id })
}
