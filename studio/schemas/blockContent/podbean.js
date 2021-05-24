import React from "react"

const Iframe = ({ value }) => {
  return <div dangerouslySetInnerHTML={{ __html: value.code }} />
}

export default {
  name: "podbean",
  title: "Podbean",
  type: "object",
  fields: [{ name: "iframe", title: "Code", type: "text" }],
  preview: {
    select: { code: "iframe" },
    component: Iframe,
  },
}
