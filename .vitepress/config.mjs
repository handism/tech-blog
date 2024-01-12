import { defineConfig } from "vitepress"

export default defineConfig({
  title: "Handism's Tech Blog",
  description: "Handism's Tech Blog",
  ignoreDeadLinks: "localhostLinks",
  lang: "ja-JP",
  cleanUrls: true,
  srcDir: "./src",
  srcExclude: ["**/README.md", "**/TODO.md", "draft/*.md"],
  markdown: {
    image: {
      // image lazy loading is disabled by default
      lazyLoading: true
    }
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
          ]
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
  }
})
