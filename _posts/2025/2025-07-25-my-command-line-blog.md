---
title: CLI Blog 全新上线
date: 2025-07-25 14:03:25 + 0080
category: [Web开发]
tags: [Design, HTML, 大制作, Programming, Product, Web]
image: /assets/attachments/2025/07/25_141416_6a89wei75328.jpg
---

欢迎来到 **ZhangSichu’s CLI Blog** 全新版本——一个以命令行为入口的博客体验空间，向 2007 年的原型致敬，同时注入现代前端技术与惊喜交互。点此感受 CLI Blog [体验地址](/assets/playground/cli-blog/cli-blog.html){:target="_blank"}

---

## 全新 CLI Blog 功能一览
新版 CLI Blog 拥有完整的命令行体验，同时在界面交互、性能、用户体验上全面升级。以下是详细功能：

| 命令 (alias)    | 参数            | 功能说明                                               |
| ----------------- | ----------------- | -------------------------------------------------------- |
| help, h, ?      | —              | 显示帮助说明                                           |
| gui, startx     | —              | 切换回图形界面浏览器                                   |
| ls, dir, list   | —              | 列出所有文章（按 ID、日期排序）                       |
| search, find    | 关键词          | 搜索文章（标题或内容匹配）                             |
| preview         | post_id（可选） | 预览指定文章；无参时预览“当前文章”                   |
| current, cursor | post_id（可选） | 显示/设置当前文章 ID，若无精确匹配则跳到最近的后续文章 |
| latest, last, l | —              | 定位并预览最新文章                                     |
| next, n         | —              | 跳转并预览下一篇文章                                   |
| prev, p         | —              | 跳转并预览上一篇文章                                   |
| first, f        | —              | 跳转并预览第一篇文章                                   |
| random, rand, r | —              | 随机预览一篇文章                                       |
| categories      | —              | 列出所有文章分类                                       |
| category        | cat_id          | 查看指定分类下的文章                                   |
| post_id         | —              | 直接预览指定 ID 的文章                                 |
| posteddate      | —              | 列出所有文章发布日期                                   |
| date            | —              | 显示当前系统日期与时间                                 |
| cls             | —              | 清屏                                                   |
| google          | 关键词          | 在 Google 中搜索关键词并跳转结果页面                   |

(指定 `post_id` 后，该文章会被设为当前文章，可通过 `current` 返回)

---

## Tags 功能等你来探索
这款 CLI Blog 还悄悄藏了一个彩蛋功能 —— **Tags 支持** 。它**未在命令列表中公开说明** ，你需要在体验过程中主动发现。

---

## 为什么还要 CLI 博客？
* **怀旧与情怀** ：命令行是开发者的记忆，是当年初学编程时的启蒙方式；
* **专注阅读体验** ：黑底绿字、无冗余 UI，强调文字本身；
* **探索乐趣** ：隐藏功能、交互尝试、命令玩法为访客增添探索心；
* **开发者友好** ：键盘控制、快速检索、无干扰阅读更适合技术人群。
