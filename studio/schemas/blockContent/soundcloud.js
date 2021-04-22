import React from "react"
import ReactPlayer from "react-player/soundcloud"

const Player = ({ value }) => {
  const { url } = value
  return <ReactPlayer url={url} />
}

export default {
  name: "soundcloud",
  title: "Soundcloud",
  type: "object",
  fields: [{ name: "url", title: "URL", type: "url" }],
  preview: {
    select: { url: "url" },
    component: Player,
  },
}
