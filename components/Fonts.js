import { Global, css } from "@emotion/react"

const Fonts = () => {
  return (
    <Global
      styles={css`
        /* Beguiat Bold */
        @font-face {
          font-family: "Beguiat Bold";
          font-style: normal;
          font-weight: 600;
          font-display: swap;
          src: url("/fonts/BenguiatStd-Bold.ttf") format("truetype");
        }
        /* Benguait Book */
        @font-face {
          font-family: "Benguait Book";
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url("/fonts/BenguiatStd-Book.ttf") format("truetype");
        }
        /* Benguiat Medium */
        @font-face {
          font-family: "Benguiat Medium";
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url("/fonts/BenguiatStd-Medium.ttf") format("truetype");
        }
      `}
    />
  )
}

export default Fonts
