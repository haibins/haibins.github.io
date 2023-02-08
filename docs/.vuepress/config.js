module.exports = {
  port:'7748',
  title: "Frey",
  description: "frey的个人博客",
  theme: "reco",
  head: [
    // 网页标签栏图标
    ["link", { rel: "icon", href: "favicon.png" }],
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
    sidebar: [
      {
        title: "欢迎学习",
        path: "/",
        collapsable: false, // 不折叠
        children: [{ title: "学前必读", path: "/" }],
      },
      {
        title: "React",
        path: "/handbook/ConditionalTypes",
        collapsable: false, // 不折叠
        children: [
          { title: "条件类型", path: "/handbook/ConditionalTypes" },
          { title: "泛型", path: "/handbook/Generics" },
          { title: "flux和redux", path: "/handbook/Redux" },
        ],
      },
      {
        title: "Css",
        path: "/css/width",
        collapsable: false, // 不折叠
        children: [
          { title: "正确使用width", path: "/css/width" },
        ],
      }
    ],
  },
};
