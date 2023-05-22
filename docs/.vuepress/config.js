const ReadFile = require("./readFile.js");

module.exports = {
  port: "8080",
  title: "Frey",
  description: "frey的个人博客",
  theme: "reco",
  head: [
    // 网页标签栏图标
    ["link", { rel: "icon", href: "favicon.ico" }],
    // 移动栏优化
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
    // 引入jquery
    [
      "script",
      {
        language: "javascript",
        type: "text/javascript",
        src: "https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js",
      },
    ],
    // 引入鼠标点击脚本
    [
      "script",
      {
        language: "javascript",
        type: "text/javascript",
        src: "/js/MouseClickEffect.js",
      },
    ],
  ],
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
  themeConfig: {
    subSidebar: "auto",
    nav: [
      {
        text: "frey的 JavaScript 博客",
        items: [
          { text: "Github", link: "https://github.com/haibins" },
          {
            text: "掘金",
            link: "https://juejin.cn/user/3949101497715543/posts",
          },
        ],
      },
    ],
    sidebar: ReadFile(),
  },
  plugins: [["vuepress-plugin-code-copy", true]],
};
