export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能(feature)
        'fix', // 修复bug
        'perf', // 性能优化
        'style', // 代码格式(不影响代码运行的变动)
        'docs', // 文档(documentation)
        'test', // 增加测试
        'refactor', // 重构(既不是增加feature，也不是修复bug)
        'build', // 打包
        'ci', // 持续集成
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'wip', // 开发中
        'workflow', // 工作流
        'types', // 类型定义文件更改
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0],
    'subject-case': [0],
    'header-max-length': [2, 'always', 72],
  },
};
