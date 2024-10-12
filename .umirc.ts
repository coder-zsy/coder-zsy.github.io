import { defineConfig } from "umi";
// import GetDirectoryContentPlugin from "./plugins/getDirectoryContent"; // 确保路径正确

const path = require("path");

export default defineConfig({
  alias: {
    //   "@": process.cwd() + "/src", // 定义 @ 别名指向 src 目录
    "@": path.resolve(__dirname, "src"), // 定义 @ 别名指向 src 目录
    "@public": path.resolve(__dirname, "public"), // 定义 @ 别名指向 src 目录
    // "@public": "./public",
  },
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
    {
      path: "/article",
      component: "@/pages/article",
      routes: [
        { path: "/article/index", redirect: "/article/index" },
        {
          path: "/article/articleDetail",
          component: "@/pages/article/articleDetail",
        },
      ],
    },
  ],
  // copy: [{ from: "src/docs", to: "dist/docs" }],
  npmClient: "pnpm",
  // import componentsList from '@/componentsList';
  // console.log(componentsList); // 打印出所有组件文件的路径
  // chainWebpack(memo, { env }) {
  //   memo.resolve.alias.set("@", path.resolve(__dirname, "src"));

  //   memo.plugin("get-directory-content").use(GetDirectoryContentPlugin, [
  //     {
  //       rootDir: process.cwd(),
  //       directory: "src/components",
  //       output: "dist/componentsList.js", // 输出结果到哪里
  //     },
  //   ]);
  // },
});
