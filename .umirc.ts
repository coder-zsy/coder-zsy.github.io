import { defineConfig } from 'umi';
import ScriptWebpackPlugin from './buildScript/scriptWebpackPlugin';

const path = require('path');

export default defineConfig({
  /**
   * github pages 里选不到dist目录，就把这里的输出目录改掉
   * */
  outputPath: 'docs',
  alias: {
    //   "@": process.cwd() + "/src", // 定义 @ 别名指向 src 目录
    '@': path.resolve(__dirname, 'src'), // 定义 @ 别名指向 src 目录
    '@public': path.resolve(__dirname, 'public'), // 定义 @ 别名指向 src 目录
  },
  // history: {
  //   type: 'hash', // 使用 hash 路由
  // },
  routes: [
    // 错误的路由
    { path: '/*', component: '@/pages/index' },
    // 没有layout（layout里是空的）包裹的路由
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/', component: 'index' },
        { path: '/docs', component: '@/pages/docs' },
        {
          path: '/imageAnalyzer',
          component: '@/pages/imageAnalyzer/index',
          title: '图片元数据分析',
        },
      ],
    },
    {
      path: '/printerMate',
      component: '@/layouts/index',
      routes: [
        {
          path: '/printerMate/privacyAgreement',
          component: '@/pages/printerMate/privacyAgreement',
        },
        {
          path: '/printerMate/userAgreement',
          component: '@/pages/printerMate/userAgreement',
        },
        {
          path: '/printerMate/helpManual',
          component: '@/pages/printerMate/helpManual',
        },
        {
          path: '/printerMate/instructionManual',
          component: '@/pages/printerMate/instructionManual',
        },
        {
          path: '/printerMate/download',
          component: '@/pages/printerMate/download',
        },
      ],
    },
    // layout包裹的带菜单的路由
    {
      path: '/article',
      component: '@/layouts/menuLayout',
      routes: [
        {
          path: '/article/index',
          component: '@/pages/article/index',
          // redirect: '/article/index',
          title: '文章详情',
        },
        {
          path: '/article/articleDetail',
          component: '@/pages/article/articleDetail',
          title: '文章详情测试',
        },
      ],
    },
  ],
  // umi多语言配置参考：https://umijs.org/docs/max/i18n
  // locale: {
  //   default: 'en-US',
  //   baseSeparator: '-',
  // },
  /**
   *
   * umi框架下public目录中的资源会直接复制到构建输出目录，所以这里不用再复制资源文件了
   */
  // copy: [{ from: "src/xx", to: "dist/xxx" }],
  npmClient: 'pnpm',
  chainWebpack: (memo) => {
    memo.plugin('mdFloderGeneratorPlugin').use(ScriptWebpackPlugin, [
      // { scriptPath: "./buildScript/generateDocsConfig.js" },
      {
        scriptPath: path.resolve(
          __dirname,
          'buildScript/generateDocsConfig.js',
        ),
      },
    ]);
  },
});
