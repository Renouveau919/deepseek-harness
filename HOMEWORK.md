# 作业一：my-ai-infra SDD 阶段启动器

本仓库是在 DeepSeek Harness 源码基础上完成的作业提交：用 my-ai-infra 的 SDD 流程开发了一个可在 DSH Web 中运行的插件。插件源码、SDD 过程产物与验收记录都在本仓库内。

## 插件用途

`plugins/my-sdd-launcher/` 是一个 DSH bundle。它在会话输入框下方常驻一条「SDD 阶段」栏，列出 my-ai-infra 的 8 个阶段：

需求 → 产品规格 → 技术方案 → 方案评审 → 测试计划 → 编码实现 → 代码评审 → 验收

点击任一阶段，插件把该阶段的提示词写入当前会话输入框（`inputActions.setDraft`），用户确认后按 Enter 发送，Agent 随即调用对应的 `my-*` Skill。没有可用输入框时回退为「在当前工作区新建会话并填入提示词」，失败会在栏内显示原因。

插件不新增 Host 服务、不读写 `mai-specs/`、不自动发送消息，只使用 DSH 已公开的客户端扩展点。

## 运行

前置：Node.js 22+，以及一个能启动的 DSH（本仓库或已安装的 `dsh`）。

### 方式一：在已运行的 DSH 中安装（最快）

```sh
# 1. 启动 Web（若尚未启动）
npx @deepseek-ai/dsh web

# 2. 安装插件（把 <repo> 换成本仓库绝对路径）
dsh plugin install <repo>/plugins/my-sdd-launcher
```

在 DSH 设置 → 插件中确认 `SDD stage launcher` 已启用，然后刷新页面，输入框下方出现「SDD 阶段」栏即为生效。

### 方式二：从本仓库源码启动

```sh
pnpm install
pnpm run build
pnpm dsh web
```

启动后按方式一第 2 步安装插件。本仓库的插件是独立 bundle，不参与 `packages/` 的 TypeScript 构建，因此修改 `plugins/my-sdd-launcher/client.js` 后刷新页面即可。

### 验证

| 检查 | 命令 / 动作 | 预期 |
|---|---|---|
| bundle 已安装 | `dsh plugin list` 或在设置 → 插件中查看 | `@local/my-sdd-launcher` 已启用 |
| 阶段栏渲染 | 打开任一会话 | 输入框下方出现「SDD 阶段」与 8 个按钮 |
| 填充输入框 | 点击「技术方案」 | 输入框变为 `使用 my-create-design 为当前 Feature 编写技术方案。` |
| 不自动发送 | 检查消息列表 | 不新增消息，草稿可继续编辑 |

## SDD 过程产物

全部位于 [`mai-specs/999-sdd-stage-launcher/`](mai-specs/999-sdd-stage-launcher/)：

| 阶段 | 文件 |
|---|---|
| 需求简报 | [BRIEF.md](mai-specs/999-sdd-stage-launcher/BRIEF.md) |
| 产品规格 | [spec/PRD.md](mai-specs/999-sdd-stage-launcher/spec/PRD.md) |
| 技术方案 | [design/TECH_DESIGN.md](mai-specs/999-sdd-stage-launcher/design/TECH_DESIGN.md) |
| 方案评审 | [review/design_review.md](mai-specs/999-sdd-stage-launcher/review/design_review.md) |
| 测试计划 | [test/TEST_PLAN.md](mai-specs/999-sdd-stage-launcher/test/TEST_PLAN.md) |
| 代码评审 | [review/code_review.md](mai-specs/999-sdd-stage-launcher/review/code_review.md) |
| 验收记录 | [test/ACCEPTANCE.md](mai-specs/999-sdd-stage-launcher/test/ACCEPTANCE.md) |
| 证据清单 | [test/EVIDENCE.json](mai-specs/999-sdd-stage-launcher/test/EVIDENCE.json) |

索引见 [mai-specs/ROADMAP.md](mai-specs/ROADMAP.md)。

## my-ai-infra 初始化说明

- 使用 `@easyuseai/my-ai-infra@0.0.15` 在本仓库根目录执行过 `mai init`（工具档位 `codex` + `claudecode`），`mai doctor` 通过。
- 仓库保留 `.my-ai-infra.json` 记录工具与 Skill 选择，保留 `mai-specs/` 作为过程产物。
- 为避免把上游 `AGENTS.md` / `CLAUDE.md` 改写成软链、并避免提交个人化受管资产，仓库**没有提交** `mai init` 生成的 `.agents/skills/my-*`、`.agents/rules/`、`.codex/` 等目录；需要复现时在仓库根目录重新执行 `mai init` 即可。

## 分支

代码与过程产物均在本仓库默认分支（`master`）上，无额外分支。

## 验证状态

- 自动证据：插件安装 `application: applied`、bundle 已启用、槽位 `my-sdd-launcher` 注册且 `active: true`、`node --check` 通过。
- 人工证据：浏览器内点击验证（TC3–TC9）需评审者在自己的 DSH 中执行，见 [ACCEPTANCE.md](mai-specs/999-sdd-stage-launcher/test/ACCEPTANCE.md)。
