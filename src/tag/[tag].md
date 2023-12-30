---

---

<script setup>
import { data as posts } from '../../.vitepress/theme/components/posts.data.mjs'
import { useData } from "vitepress"
const { params } = useData()
const tag = params.value.tag
</script>

<ul>
    <template v-for="post of posts">
        <li v-if="post.frontmatter.tags && post.frontmatter.tags.includes(tag)">
            <a :href="post.url">{{ post.frontmatter.title }}</a>
        </li>
    </template>
</ul>
