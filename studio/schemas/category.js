import { GrTree } from "react-icons/gr"
export default {
  name: "category",
  title: "Category",
  icon: GrTree,
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
  ],
}
