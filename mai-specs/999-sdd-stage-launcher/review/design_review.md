# 999 SDD 阶段启动器 — 方案评审

| 项 | 值 |
|---|---|
| 评审对象 | [技术方案](../design/TECH_DESIGN.md) |
| 评审人 | 主 Agent（自查 + 对照 DSH 扩展点文档） |
| 结论 | 通过，进入实现；2 项中等风险已接受并记录 |

## 1. 问题定义

方案把「阶段难回忆」转化为「点击 → 填提示词」，没有把范围扩大到 Feature 解析、自动执行或验收看板，符合 PRD 的非目标。MVP 成立。

## 2. 关键假设核对

| 假设 | 证据 | 结论 |
|---|---|---|
| `conversation.composer.dock` 是允许外部 bundle 注册的 list 槽位，且作用域内有 `inputActions` | `Slots.listSubTree(root=conversation.composer.dock)` 返回 `standardProps` 含 `inputActions: InputActions` | 成立 |
| `inputActions.setDraft(text)` 可替换当前草稿 | `packages/client/ui-conversation/src/client/contract/input.ts` 中 `InputActions.setDraft` 注释「Replace the whole draft with plain text」 | 成立 |
| 回退 `uiWorkspace.startSession(undefined, { prompt })` 可用 | `StartSessionOptions extends DraftInitializationOptions`，`prompt` 属其字段；`startSession` 文档注明缺省工作区继承当前或最近工作区 | 成立（语义依赖宿主行为） |
| 独立 bundle 可不经 `packages/` 构建被安装 | `plugin_manager install_bundle` 对目录执行 pnpm link，返回 `application: applied` | 成立 |

## 3. 发现与处理

| ID | 级别 | 发现 | 处理 |
|---|---|---|---|
| DR1 | 中 | 回退路径依赖 `startSession(undefined)` 的「继承当前或最近工作区」语义；若宿主改为必须显式 workspaceId，回退会失败。 | 接受。失败已被捕获并显示原因；主路径不依赖该语义。记录为升级跟进点。 |
| DR2 | 中 | 阶段提示词是前端常量，与 `mai-specs` 的阶段清单可能漂移（例如新增阶段 Skill）。 | 接受。8 个阶段与当前 my-ai-infra 0.0.15 的阶段 Skill 一致；后续可通过 Feature 扩展为读取配置。 |
| DR3 | 低 | 界面文案硬编码中文，未接入 Client locale 服务。 | 接受。bundle 未注册 locale 命名空间；本次目标用户为中文开发者，作业范围内保持最小实现。 |
| DR4 | 低 | 内联样式而非 CSS Modules，无法复用宿主既有控件外观。 | 接受。颜色全部取 `--dsw-*` 变量并提供回退值，避免主题失配。 |
| DR5 | 低 | 组件在 `apply` 内定义，插件重载会重建组件身份并重置本地状态。 | 接受。状态仅为一次性提示文案，重载丢失无影响。 |

## 4. 过度设计检查

- 未引入 Host 服务、RPC、持久化、配置项：当前无消费者需要，符合「无当前所有者不新增抽象」。
- 未做 Feature 解析与阶段进度推断：超出 PRD 范围，且需要文件系统契约，先不做。

## 5. 结论

方案满足 AC1–AC6，风险均有明确的失败可见性；进入实现。实现完成后按 [测试计划](../test/TEST_PLAN.md) 验证，并在 [代码评审](code_review.md) 中复核实际代码。
