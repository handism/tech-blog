// https://vitepress.dev/guide/custom-theme
import SimplaLayout from './SimplaLayout.vue'
import './style.css'

/** @type {import('vitepress').Theme} */
export default {
  Layout: SimplaLayout,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
}

