import { createContentLoader } from "vitepress"

export default createContentLoader("src/*.md", {
  includeSrc: false,
  transform(rawData) {
    return rawData
      .filter(page => page.frontmatter.tags)
      .sort((a, b) => {
        return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
      })
  }
})