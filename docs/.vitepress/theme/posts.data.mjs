// posts.data.js
import { createContentLoader } from 'vitepress'

export default createContentLoader('**/*.md', {
    includeSrc: false,
    transform(rawData) {
        return rawData
            .filter(page => !page.url.endsWith("/"))
            .sort((a, b) => {
                return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
            })
    }
})