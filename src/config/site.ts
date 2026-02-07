export const siteConfig = {
  name: "Handism's Tech Blog",
  url: "https://handism.github.io",
  description: "技術的な学びや備忘録を記録するための個人ブログ",
  author: "handism",
  github: "https://github.com/handism",
  rss: {
    title: "Handism's Tech Blog",
    description: "最新記事一覧",
    revalidateSeconds: 3600,
  },
  posts: {
    dir: "md",
    defaultCategory: "uncategorized",
    defaultTitle: "No title",
  },
  pagination: {
    postsPerPage: 10,
  },
};
