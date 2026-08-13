# xhs-ai-ip-content 源仓库

## 职责边界

此仓库是 `xhs-ai-ip-content` 及其 Eval 的唯一源头，也是 Codex 实际加载的运行目录。

内容判断、事实边界、表达逻辑与 Review 规则只写在 `SKILL.md` 和 `references/` 中；不要在本文件或消费该 Skill 的工作区 `AGENTS.md` 复制第二套内容规则。

## Skill 与 Eval 维护

- 普通内容生产、改稿和 Review 不运行 Eval。
- 修改 `SKILL.md`、`references/`、Eval 提示、脚本或测试用例后，运行 `evals/` 中全部既有回归案例。
- 新规则只解决已经出现的真实问题；接纳前至少增加一个应失败反例和一个应通过对照。
- 任一既有案例失败时，不提交或发布本次 Skill 修改。
- Eval 用于验证 Skill，不得变成日常内容生产的预检步骤或读者可见流程。
