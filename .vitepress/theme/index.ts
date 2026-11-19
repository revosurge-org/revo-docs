// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import 'katex/dist/katex.min.css'
import './style.css'
import './adflow.css'
import './RevoSurge_AdFlow_Docs_AdFlowOnly.css'
import HttpMethod from './components/HttpMethod.vue'
import EventPayloadExplorer from './components/EventPayloadExplorer.vue'
import CreativePreviews from './components/CreativePreviews.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // Globally registered so any locale's Markdown can use them without imports.
    app.component('HttpMethod', HttpMethod)
    app.component('EventPayloadExplorer', EventPayloadExplorer)
    app.component('CreativePreviews', CreativePreviews)
  }
} satisfies Theme
