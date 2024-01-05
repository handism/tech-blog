import { defineConfig } from "vitepress"

export default defineConfig({
  title: "handism's tech blog",
  description: "handism's tech blog",
  ignoreDeadLinks: "localhostLinks",
  lang: "ja-JP",
  cleanUrls: true,
  srcDir: "./src",
srcExclude: ["**/README.md", "**/TODO.md", "draft/*.md"],
  head: [
          ["link", {rel: "icon", href: "/favicon.ico"}],
          ["link", {rel: "preconnect", href: "https://fonts.googleapis.com"}],
          ["link", {rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: ""}],
          ["link", {href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700&display=swap", rel: "stylesheet"}]
        ],
  lastUpdated: true,
  sitemap: {hostname: "https://handism.github.io"},

  themeConfig: {
    siteTitle: "handism's tech blog",
    footerNav: [
      {text: "about", link: "/about-this-blog"},
      {text: "sitemap", link: "/"},
      {text: "privacy policy", link: "/"}
    ],
    socialLinks: [{icon: "github", link: "https://github.com/handism"}]
  }
})
