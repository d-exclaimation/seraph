import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Seraph",
  description: "Hassle-free web apps, in an instant",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/getting-started/introduction" },
      {
        text: "npm",
        link: "https://www.npmjs.com/package/@d-exclaimation/seraph",
      },
    ],

    sidebar: [
      {
        text: "Getting started",
        items: [
          { text: "Introduction", link: "/getting-started/introduction" },
          { text: "Quick start", link: "/getting-started/quickstart" },
          {
            text: "Adding to existing project",
            link: "/getting-started/existing-project",
          },
        ],
      },
      {
        text: "Concepts",
        items: [
          { text: "States", link: "/concepts/states" },
          { text: "Components", link: "/concepts/components" },
          { text: "Rendering", link: "/concepts/rendering" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/d-exclaimation/seraph" },
      { icon: "twitter", link: "https://twitter.com/dexclaimation" },
    ],

    logo: "/seraph.png",
  },
});
