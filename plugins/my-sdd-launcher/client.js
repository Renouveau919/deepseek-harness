window.__ModuleLoader__.load({
  id: '@local/my-sdd-launcher',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    /** One SDD stage: the chip label and the prompt it stages for the agent. */
    const STAGES = [
      {
        id: 'feature',
        label: '需求',
        prompt: '使用 my-create-feature 为当前项目创建一个新需求：请补充标题、范围与背景。',
      },
      {
        id: 'prd',
        label: '产品规格',
        prompt: '使用 my-create-prd 为当前 Feature 编写或更新 PRD。',
      },
      {
        id: 'design',
        label: '技术方案',
        prompt: '使用 my-create-design 为当前 Feature 编写技术方案。',
      },
      {
        id: 'design-review',
        label: '方案评审',
        prompt: '使用 my-review-design 评审当前 Feature 的技术方案，并给出可执行的修改建议。',
      },
      {
        id: 'test-plan',
        label: '测试计划',
        prompt: '使用 my-create-test-plan 为当前 Feature 生成或更新测试计划。',
      },
      {
        id: 'implement',
        label: '编码实现',
        prompt: '使用 my-implement-code 按已确认的技术方案实现当前 Feature。',
      },
      {
        id: 'code-review',
        label: '代码评审',
        prompt: '使用 my-review-code 评审当前 Feature 的实现。',
      },
      {
        id: 'acceptance',
        label: '验收',
        prompt: '使用 my-create-test-plan 对当前 Feature 执行业务验收，并记录证据与未覆盖项。',
      },
    ]

    const TITLE = 'SDD 阶段'
    const HINT = '点击阶段会把该阶段的提示词填入当前输入框，确认后发送即可。'

    const colors = {
      text: 'var(--dsw-color-text-secondary, #5b6472)',
      strong: 'var(--dsw-color-text-primary, #1f2329)',
      line: 'var(--dsw-color-border-subtle, rgba(127, 127, 127, 0.25))',
      chip: 'var(--dsw-color-surface-raised, rgba(127, 127, 127, 0.08))',
      error: 'var(--dsw-color-danger, #c0392b)',
    }

    return {
      inject: ['slots', 'uiWorkspace'],
      apply(ctx) {
        function Launcher(props) {
          const [status, setStatus] = React.useState(null)
          const inputActions = props?.inputActions

          function canFillComposer() {
            return inputActions !== undefined && typeof inputActions.setDraft === 'function'
          }

          function launch(stage) {
            try {
              if (canFillComposer()) {
                inputActions.setDraft(stage.prompt)
                setStatus({ kind: 'ok', text: `已填入「${stage.label}」提示词，按 Enter 发送` })
                return
              }
              ctx.uiWorkspace.startSession(undefined, { prompt: stage.prompt })
              setStatus({ kind: 'ok', text: `已为「${stage.label}」新建会话并填入提示词` })
            } catch (error) {
              const message = error instanceof Error ? error.message : String(error)
              setStatus({ kind: 'error', text: `无法启动阶段：${message}` })
            }
          }

          return h('div', {
            role: 'group',
            'aria-label': TITLE,
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px',
              borderTop: `1px solid ${colors.line}`,
              color: colors.text,
              fontSize: '12px',
              lineHeight: '20px',
            },
          },
            h('span', { style: { fontWeight: 600, color: colors.strong, marginRight: '4px' } }, TITLE),
            ...STAGES.map(stage => h('button', {
              key: stage.id,
              type: 'button',
              title: stage.prompt,
              onClick: () => launch(stage),
              style: {
                border: `1px solid ${colors.line}`,
                borderRadius: '999px',
                background: colors.chip,
                color: colors.strong,
                cursor: 'pointer',
                font: 'inherit',
                padding: '1px 10px',
              },
            }, stage.label)),
            h('span', {
              role: status?.kind === 'error' ? 'alert' : 'status',
              style: {
                marginLeft: '4px',
                color: status?.kind === 'error' ? colors.error : colors.text,
              },
            }, status?.text ?? HINT),
          )
        }

        ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
          name: 'conversation.composer.dock',
          id: 'my-sdd-launcher',
          order: 20,
        }, Launcher))
      },
    }
  },
})
