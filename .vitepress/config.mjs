import { defineConfig } from "vitepress"

export default defineConfig({
  title: "Handism's Tech Blog",
  description: "Handism's Tech Blog",
  ignoreDeadLinks: "localhostLinks",
  lang: "ja-JP",
  cleanUrls: true,
  srcDir: "./src",
  srcExclude: ["**/README.md", "draft/*.md", "template/*.md"],
  markdown: {
    image: {lazyLoading: true}
  },
  head: [
          ["link", {rel: "icon", href: "/favicon.ico"}],
          ["link", {rel: "preconnect", href: "https://fonts.googleapis.com"}],
          ["link", {rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: ""}],
          ["link", {href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700&display=swap", rel: "stylesheet"}],
          ["link", {rel: "stylesheet", href: "https://fonts.googleapis.com/icon?family=Material+Icons"}],
          ["script", {async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-MSJLEN90KY"}],
          ["script", {},
            `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MSJLEN90KY');`
          ],
          ["meta", { property: "og:site_name", content: "Handism's Tech Blog" }]
        ],
  lastUpdated: true,
  sitemap: {hostname: "https://handism.github.io"},

  themeConfig: {
    siteTitle: "Handism's Tech Blog",
    footerNav: [
      {text: "About", link: "/about"},
      {text: "Sitemap", link: "/sitemap"},
      {text: "GitHub", link: "https://github.com/handism"}
    ]
  },

  async transformHead(context) {
    return [
      ["meta", { property: "og:title", content: context.pageData.title }],
      ["meta", { property: "og:image", content: `https://handism.github.io/${context.pageData.frontmatter.image ? context.pageData.frontmatter.image : "site-image.webp"}`}]
    ]
  }

})
