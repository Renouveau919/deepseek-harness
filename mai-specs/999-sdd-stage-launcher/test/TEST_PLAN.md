# 999 SDD 阶段启动器 — 测试计划

| 项 | 值 |
|---|---|
| Feature | 999-sdd-stage-launcher |
| 关联 | [PRD](../spec/PRD.md) · [技术方案](../design/TECH_DESIGN.md) |
| 执行环境 | Windows 11 + DSH Web（`http://127.0.0.1:56896`），插件以目录 bundle 安装 |

## 1. 范围

覆盖插件安装、槽位渲染、点击填充、回退与失败提示、刷新后仍生效、对既有 UI 的影响。不覆盖 DSH 自身输入框、发送链路与 Skill 内容（宿主/资产已有职责）。

## 2. 用例

| ID | 场景 | 前置 | 步骤 | 预期 | 类型 |
|---|---|---|---|---|---|
| TC1 | 安装生效 | 未安装本 bundle | `plugin_manager install_bundle` 指向插件目录 | 返回 `application: applied`、`warnings: []`；无 build 脚本待批准 | 自动 |
| TC2 | 槽位注册 | TC1 通过 | 查询 `Slots.listSubTree(root=conversation.composer.dock)` | `occupants` 含 `my-sdd-launcher`，`active: true`，`order: 20` | 自动 |
| TC3 | 渲染阶段栏 | 打开任一有会话的页面 | 目视输入框下方 | 出现「SDD 阶段」与 8 个按钮（需求、产品规格、技术方案、方案评审、测试计划、编码实现、代码评审、验收） | 人工 |
| TC4 | 填充当前输入框（AC2/AC3） | 页面有当前会话，输入框为空 | 点击「技术方案」 | 输入框内容为「使用 my-create-design 为当前 Feature 编写技术方案。」；栏内提示「已填入…，按 Enter 发送」 | 人工 |
| TC5 | 不误发 | TC4 后 | 检查会话消息列表 | 不新增消息，草稿仍可编辑 | 人工 |
| TC6 | 保留既有内容 | 输入框已有文字 | 点击「验收」 | 草稿被替换为验收提示词；提示仍可见 | 人工 |
| TC7 | 回退与失败提示（AC4） | 在无会话/无 `inputActions` 的环境 | 点击任意阶段 | 走 `startSession` 分支并提示「已为…新建会话」；异常时显示 `无法启动阶段：…` 且 `role="alert"` | 代码路径 + 人工触发 |
| TC8 | 刷新后仍在（AC6） | TC1 后 | 刷新页面 | 阶段栏仍渲染，无残留错误文案 | 人工 |
| TC9 | 无副作用（AC5） | — | 对比安装前后输入框、通知区、其他插件条目 | 除新增阶段栏外无变化 | 人工 |
| TC10 | 静态检查 | — | `node --check client.js`、`node --check index.js`、校验 `package.json` 与 `cordis.patch.yml` | 语法与清单合法 | 自动 |

## 3. 执行条件与限制

- DSH Web 需保持运行；插件以目录链接方式安装，修改源码后刷新页面生效。
- 槽位查询通过 `cordis_inspect_query`（Client `Slots`）完成，不依赖截图；TC3–TC9 中涉及视觉与交互的部分需人工在浏览器中确认，本计划把「安装 + 注册」的自动证据与「实际点击」的人工证据分开记录。
- 无 API Key 也可执行全部用例（不触发模型调用）。

## 4. 通过与失败判定

- 通过：TC1、TC2、TC10 全绿；TC3–TC9 人工确认无偏差。
- 部分通过：自动项通过、人工项尚未目视，须在验收记录中标注「未验证」，不得记为通过。
- 失败：任一 AC 对应用例不满足，回到实现修复后复测。
