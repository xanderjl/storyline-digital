import React from "react"

const AboutView = () => {
  const url =
    process.env.NODE_ENV === "production"
      ? `https://storyline.digital/about?preview`
      : `http://localhost:3000/about?preview`

  return (
    <div
      style={{
        padding: "1em",
      }}
    >
      <div
        style={{
          border: 0,
          height: "100%",
          left: 0,
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      >
        <iframe
          style={{ width: "100%", height: "100vh" }}
          src={url}
          frameBorder={"0"}
        />
      </div>
    </div>
  )
}

export default AboutView
