# 全局项目布局

当前阶段，本仓库承担两个角色：

- 公司官网: 展示 IT 系统开发能力和行业 demo 入口。
- 居酒屋点菜 demo: 作为第一个可演示、可复制、可交付的行业模板。

## 当前目录

```text
/
  index.html                 公司官网
  order/                     堂食顾客扫码点菜 demo
  takeout/                   外卖・到店自取 demo
  kitchen/                   厨房接单 demo
  checkout/                  会计收银 demo
  admin/                     后台管理 demo
  assets/                    点菜系统共享 JS/CSS
  tests/                     核心逻辑和多语言测试
  docs/                      演示、交付、定制说明
  PROJECT_RULES.md           本项目开发规则
```

## 多行业系统的推荐布局

公司官网只做总入口。其他行业 demo 可以在独立项目里开发，成熟后再从公司官网链接过去。

```text
company-site
  ├─ izakaya demo link
  ├─ used car demo link
  ├─ recycle demo link
  ├─ real estate demo link
  └─ contact

demo-izakaya-ordering
demo-usedcars
demo-recycle
demo-realestate

client-{customer}-izakaya
client-{customer}-usedcars
client-{customer}-recycle
client-{customer}-realestate
```

## 当前仓库的短期策略

现在不急着拆仓库。先把当前仓库作为：

- 公司官网
- 居酒屋点菜 demo
- 居酒屋行业模板

等其他行业 demo 成熟后，再决定是放到公司官网子目录，还是保留独立仓库并从公司官网跳转。

## 链接原则

- 公司官网的 `#solutions` 区块负责展示行业系统入口。
- 已完成 demo 使用真实链接。
- 未完成 demo 显示“准备中”。
- 客户项目不要直接混入 demo 仓库。

