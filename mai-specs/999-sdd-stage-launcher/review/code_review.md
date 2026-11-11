# 999 SDD 阶段启动器 — 代码评审

| 项 | 值 |
|---|---|
| 评审对象 | `plugins/my-sdd-launcher/`（`client.js`、`index.js`、`package.json`、`cordis.patch.yml`、`locale/*`、`icon.svg`） |
| 评审依据 | [PRD](../spec/PRD.md)、[技术方案](../design/TECH_DESIGN.md)、DSH 槽位与 bundle 规范 |
| 结论 | 通过；1 项实现缺陷已修复（插槽入参读取），3 项已知限制保留并在验收记录标注 |

## 1. 逐项核对

| 检查点 | 结果 |
|---|---|
| bundle 清单：`dsh.bundle.patch`、`dsh.client`、`exports`、`files` 齐全且互相对应 | 通过 |
| 补丁只插入一条行，不覆盖既有行 | 通过（`- insert: [{ id: my-sdd-launcher, name: '@local/my-sdd-launcher' }]`） |
| Host 半边导出形式单一（`export function apply()`，无 default） | 通过 |
| Client 工厂 id 与包名一致 | 通过（`@local/my-sdd-launcher`） |
| 槽位注册走 `ctx.slots.inject`，随声明撤销 | 通过 |
| 只使用声明过的依赖服务（`slots`、`uiWorkspace`） | 通过 |
| 主路径使用槽位入参 `inputActions.setDraft`，回退路径有失败可见性 | 通过（评审首轮发现初版直接调 `startSession`，已改为优先填当前输入框） |
| 状态与文案：成功 `role="status"`、失败 `role="alert"` | 通过 |
| 无全局变量、无 DOM 监听、无跨会话缓存 | 通过 |
| 主题色来自 `--dsw-*` 变量，均有回退值 | 通过 |
| 显示元数据与图标：`locale/{zh,en}.json` 的 `meta.title/description`、`icon.svg`（525 B） | 通过 |

## 2. 发现

| ID | 级别 | 位置 | 问题 | 处理 |
|---|---|---|---|---|
| CR1 | 高 | `client.js` 初版 | 只调用 `uiWorkspace.startSession`，会新建会话，而 PRD US3 要求「进入当前输入框、发送前可编辑」。 | 已修复：主路径改为 `props.inputActions.setDraft`，`startSession` 仅作回退。 |
| CR2 | 中 | `client.js` | 回退分支依赖宿主「缺省工作区继承当前或最近工作区」的语义。 | 保留；失败会显示原因，已在方案评审 DR1 记录。 |
| CR3 | 低 | `client.js` | 文案未接 Client locale 服务（硬编码中文）。 | 保留；与设计评审 DR3 一致，作业范围最小实现。 |
| CR4 | 低 | `client.js` | 内联样式在每次渲染重建对象。 | 保留；组件体量小，无性能影响，且避免额外 CSS 构建。 |
| CR5 | 低 | `locale/en.json` | 英文 `meta.description` 与中文语义不完全对齐（英文更短）。 | 保留；两者都准确描述能力。 |

## 3. 验证证据

- `node --check client.js`、`node --check index.js` 均通过。
- `plugin_manager install_bundle` 返回 `application: applied`、`warnings: []`。
- `Slots.listSubTree(root=conversation.composer.dock)` 中占用项 `my-sdd-launcher` 为 `active: true`，`order: 20`。
- 详见 [验收记录](../test/ACCEPTANCE.md) 与 [证据清单](../test/EVIDENCE.json)。

## 4. 合并建议

可以合入。未验证项（浏览器内目视点击）已在验收记录中标为「未验证」，不记为通过。
