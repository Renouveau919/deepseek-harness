# 999: SDD 阶段启动器

| 项 | 值 |
|---|---|
| Phase | review |
| Profile | standard |
| 优先级 | P1 |
| 负责人 | 待填 |
| 目标日期 | 待填 |
| 涉及子系统 | DSH Web 插件（Host + Client bundle）、mai-specs 规格 |

## 一句话描述

在 DSH Web 中输入框下方提供 SDD 阶段栏，点击阶段把对应 Skill 的提示词填入当前会话

## 背景

使用 my-ai-infra 的 SDD 流程时，开发者需要手工回忆当前 Feature、阶段顺序与对应 Skill 的调用方式，频繁离开会话查文档；希望在工作台内看到阶段清单，并直接得到可发送的提示词。

## 关键决策

- 采用独立 bundle（`plugins/my-sdd-launcher/`），不改 `packages/`：插件只需一个 Client 槽位，独立目录可安装、可随仓库提交。
- 主路径写当前输入框草稿（`inputActions.setDraft`），不自动发送；`startSession` 仅作回退，保留人工确认。
- 阶段提示词为常量，不解析 `mai-specs/`：避免引入文件系统契约，聚焦「一键得到可发送提示词」。
- 界面颜色取自 `--dsw-*` 变量；文案中文，插件元数据中英双语。

## 上下文索引

- [素材索引](context/_INDEX.md)
