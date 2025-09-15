module.exports = [
  {
    key: '/articles/business',
    label: 'business',
    type: 'directory',
    children: [
      {
        key: '/articles/business/profit_review.md',
        label: '《盈利》作业',
        type: 'file',
      },
      {
        key: '/articles/business/test.md',
        label: '测试文件',
        type: 'file',
      },
    ],
  },
  {
    key: '/articles/cognition',
    label: 'cognition',
    type: 'directory',
    children: [],
  },
  {
    key: '/articles/develop',
    label: 'develop',
    type: 'directory',
    children: [
      {
        key: '/articles/develop/aliCloud',
        label: 'aliCloud',
        type: 'directory',
        children: [],
      },
      {
        key: '/articles/develop/engineeringEfficiency',
        label: 'engineeringEfficiency',
        type: 'directory',
        children: [
          {
            key: '/articles/develop/engineeringEfficiency/vim.md',
            label: 'vim',
            type: 'file',
          },
        ],
      },
      {
        key: '/articles/develop/linux',
        label: 'linux',
        type: 'directory',
        children: [
          {
            key: '/articles/develop/linux/nginx.md',
            label: 'Nginx',
            type: 'file',
          },
          {
            key: '/articles/develop/linux/tree.md',
            label: '显示目录结构',
            type: 'file',
          },
        ],
      },
      {
        key: '/articles/develop/web',
        label: 'web',
        type: 'directory',
        children: [
          {
            key: '/articles/develop/web/React',
            label: 'React',
            type: 'directory',
            children: [
              {
                key: '/articles/develop/web/React/react_markdown.md',
                label: '在react中解析markdown文件',
                type: 'file',
              },
            ],
          },
          {
            key: '/articles/develop/web/VUE',
            label: 'VUE',
            type: 'directory',
            children: [
              {
                key: '/articles/develop/web/VUE/::-v-deep.md',
                label: '特殊选择器::v-deep',
                type: 'file',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: '/articles/management',
    label: 'management',
    type: 'directory',
    children: [],
  },
];
