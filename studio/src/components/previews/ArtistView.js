import React from "react"

const ArtistView = ({ document }) => {
  const { displayed } = document
  if (!displayed?.slug?.current) {
    return <div>The product needs a slug before it can be previewed.</div>
  }
  const url =
    process.env.NODE_ENV === "production"
      ? `https://storyline.digital/artists/${displayed?.slug?.current}?preview`
      : `http://localhost:3000/artists/${displayed?.slug?.current}?preview`

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

export default ArtistView
