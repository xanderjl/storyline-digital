import React from "react"

const Player = props => {
  return <pre>{JSON.stringify(props, null, 2)}</pre>
}

export default {
  name: "podbean",
  title: "Podbean",
  type: "object",
  fields: [{ name: "url", title: "URL", type: "url" }],
  preview: {
    select: { url: "url" },
    component: Player,
  },
}
