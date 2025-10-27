export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档更新
        'style', // 代码格式化
        'refactor', // 重构
        'perf', // 性能优化
        'test', // 测试
        'build', // 构建系统
        'ci', // CI配置
        'chore', // 其他杂项
        'revert', // 回滚
        'wip', // 开发中
        'workflow', // 工作流
        'types', // 类型定义
      ],
    ],
    // 主题长度限制
    'subject-max-length': [2, 'always', 100],
    'subject-min-length': [2, 'always', 4],
    // 主题格式
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    // 类型格式
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    // 范围格式
    'scope-case': [2, 'always', 'lower-case'],
    // 头部格式
    'header-max-length': [2, 'always', 100],
    // 正文格式
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    // 脚注格式
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
  prompt: {
    questions: {
      type: {
        description: '选择你要提交的类型:',
        enum: {
          feat: {
            description: '🚀 新功能',
            title: 'Features',
            emoji: '🚀',
          },
          fix: {
            description: '🐛 修复bug',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: '📚 文档更新',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: '💎 代码格式化',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: '📦 重构代码',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: '🚀 性能优化',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: '🚨 测试',
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description: '🛠️ 构建系统',
            title: 'Builds',
            emoji: '🛠️',
          },
          ci: {
            description: '⚙️ CI配置',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description: '♻️ 其他杂项',
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: '🗑️ 回滚',
            title: 'Reverts',
            emoji: '🗑️',
          },
        },
      },
      scope: {
        description: '本次提交的影响范围 (可选):',
      },
      subject: {
        description: '简短描述:',
      },
      body: {
        description: '详细描述 (可选):',
      },
      isBreaking: {
        description: '是否包含破坏性变更?',
      },
      breakingBody: {
        description: '破坏性变更的详细描述:',
      },
      breaking: {
        description: '描述破坏性变更:',
      },
      isIssueAffected: {
        description: '是否影响某个issue?',
      },
      issuesBody: {
        description: '如果有issue被关闭，请描述:',
      },
      issues: {
        description: '添加issue引用 (例如: "fix #123", "re #123"):',
      },
    },
  },
}
