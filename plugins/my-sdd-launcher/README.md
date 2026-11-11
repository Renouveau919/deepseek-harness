# my-sdd-launcher

DSH Web bundle that puts the my-ai-infra SDD stages under the composer.

## What it does

Registers one entry in `conversation.composer.dock`. Clicking a stage writes that stage's prompt into the current composer draft through the slot's `inputActions.setDraft`; the user reviews it and presses Enter. When no composer actions are available it falls back to `uiWorkspace.startSession(undefined, { prompt })`.

Stages: 需求 / 产品规格 / 技术方案 / 方案评审 / 测试计划 / 编码实现 / 代码评审 / 验收.

## Install

```sh
dsh plugin install <repo>/plugins/my-sdd-launcher
```

The package is an ordinary directory bundle: `package.json` declares `dsh.bundle.patch` and `dsh.client`, `cordis.patch.yml` inserts one row, `index.js` is an empty Host half, `client.js` is the browser half.

## Files

| File | Role |
|---|---|
| `package.json` | Bundle + Client manifest, exports, display resources |
| `cordis.patch.yml` | Inserts the `my-sdd-launcher` row |
| `index.js` | Host half: `export function apply() {}` |
| `client.js` | Slot registration, stage constants, launcher component |
| `locale/{zh,en}.json` | Plugin-manager title and description |
| `icon.svg` | Original icon |

## Limitations

- Prompts are constants in the Client half; they do not read `mai-specs/`.
- Copy is Chinese-only in the rendered bar; only the plugin metadata is bilingual.
- No automated browser test; verification steps are in `mai-specs/999-sdd-stage-launcher/test/TEST_PLAN.md`.
