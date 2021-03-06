import S from "@sanity/desk-tool/structure-builder"
import AboutView from "./components/previews/AboutView"
import CreatorView from "./components/previews/CreatorView"
import DonateView from "./components/previews/DonateView"
import PostView from "./components/previews/PostView"
import SocialPreview from "part:social-preview/component"
import { BsEyeFill, BsGearFill } from "react-icons/bs"
import { AiOutlineInfoCircle } from "react-icons/ai"
import { FaMoneyBillWaveAlt } from "react-icons/fa"

const hiddenDocTypes = listItem =>
  !["siteSettings", "aboutPage", "donatePage"].includes(listItem.getId())

export default () =>
  S.list()
    .title("Pulp Inc.")
    .items([
      S.listItem()
        .title("Site Settings")
        .icon(BsGearFill)
        .child(
          S.editor()
            .id("siteSettings")
            .title("Site Settings")
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),
      S.listItem()
        .title("About")
        .icon(AiOutlineInfoCircle)
        .child(
          S.editor()
            .id("aboutPage")
            .title("About")
            .schemaType("aboutPage")
            .documentId("aboutPage")
            .views([
              S.view.form(),
              S.view.component(AboutView).title("Web").icon(BsEyeFill),
            ])
        ),
      S.listItem()
        .title("Donate")
        .icon(FaMoneyBillWaveAlt)
        .child(
          S.editor()
            .id("donatePage")
            .title("Donate")
            .schemaType("donatePage")
            .documentId("donatePage")
            .views([
              S.view.form(),
              S.view.component(DonateView).title("Web").icon(BsEyeFill),
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])

export const getDefaultDocumentNode = props => {
  /**
   * Here you can define fallback views for document types without
   * a structure definition for the document node. If you want different
   * fallbacks for different types, or document values (e.g. if there is a slug present)
   * you can set up that logic in here too.
   * https://www.sanity.io/docs/structure-builder-reference#getdefaultdocumentnode-97e44ce262c9
   */
  const { schemaType } = props

  if (schemaType === "creator") {
    return S.document().views([
      S.view.form(),
      S.view.component(CreatorView).title("Web").icon(BsEyeFill),
      S.view.component(SocialPreview()).title("Social & SEO"),
    ])
  }
  if (schemaType === "post") {
    return S.document().views([
      S.view.form(),
      S.view.component(PostView).title("Web").icon(BsEyeFill),
      S.view.component(SocialPreview()).title("Social & SEO"),
    ])
  }
  return S.document().views([S.view.form()])
}
