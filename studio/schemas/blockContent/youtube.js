import * as React from "react"
import ReactPlayer from "react-player/youtube"

const Player = ({ value }) => {
  const { url } = value
  return <ReactPlayer url={url} controls width="100%" />
}

export default {
  name: "youtube",
  title: "Youtube",
  type: "object",
  fields: [{ name: "url", title: "URL", type: "url" }],
  preview: {
    select: { url: "url" },
    component: Player,
  },
}
