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
          ["link", {href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700&display=swap", rel: "stylesheet"}],
          ["script", {async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-MSJLEN90KY"}],
          ["script", {},
            `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MSJLEN90KY');`
          ]
        ],
  lastUpdated: true,
  sitemap: {hostname: "https://handism.github.io"},

  themeConfig: {
    siteTitle: "handism's tech blog",
    footerNav: [
      {text: "About", link: "/about"},
      {text: "Sitemap", link: "/"},
      {text: "GitHub", link: "https://github.com/handism"}
    ]
  }
})
