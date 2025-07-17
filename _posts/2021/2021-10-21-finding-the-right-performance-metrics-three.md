---
title: 寻找合适的研发效能度量指标（下）
date: 2021-11-18 22:12:42 + 0080
category: [研发效能]
tags: [演讲, Software Development, Product]
image: /assets/attachments/2021/11/18_122856_4dd9untled87.jpg
---

本系列的 [上篇](/posts/finding-the-right-performance-metrics-one/) 咱们尝试回答了最近几年 “软件研发效能” 为什么会成为业界的热词 “Buzzword” ，有哪些合适的软件研发效能度量指标这两个问题。[中篇](/posts/finding-the-right-performance-metrics-two/) 分析了软件研发效能度量过程中的三个观点和观察，本篇希望能找到一个快速选择合适度量指标的方案，并聊聊在度量上下文中的 [fuzzy front end](https://en.wikipedia.org/wiki/New_product_development#Fuzzy_front_end){:target="_blank"}.

软件研发效能的度量指标和工具链越来越丰富，主打数字化转型的企业在内部也开始建设自己的效能中台了，作为一线研发人员，面对这些眼花缭乱的指标、工具和平台，不经要问：我需要把这些东西都实践了吗？什么是我最需要做的，什么是我现阶段的优先级? 在[上篇](/posts/finding-the-right-performance-metrics-one/)中咱们提到，研发效能的度量很大程度上取决于公司的类型，规模，文化，与之合作的项目类型等因素。 一个团队的度量指标很可能与其他公司或团队的完全不同，这是完全正常的事情。那么有没有一个稍微简单的方式能帮我们快速识别一些更适合现阶段的度量指标呢?

### 三种项目类型

在软件研发过程中，一般会经过三个阶段或者说接手三种类型的项目：绿地项目、棕地(黄地)项目、红地项目，（下文使用: 绿地、黄地、红地与之对应并简化代表），好像一个软件系统的生命周期。通过识别项目类型来找到此类型合适的度量指标，这可能是一个快速高效的方案。

[**绿地：**](https://en.wikipedia.org/wiki/Greenfield_project#Software_development){:target="_blank"}一个全新的项目可能是为一个全新的环境开发一个系统，而不用关心与其他系统的集成，尤其是与遗留系统的集成。
>In software development, a greenfield project could be one of developing a system for a totally new environment, without concern for integrating with other systems, especially not legacy systems. Such projects are deemed higher risk, as they are often for new infrastructure, new customers, and even new owners.

[**黄地：**](https://en.wikipedia.org/wiki/Brownfield_(software_development)){:target="_blank"}在现有（遗留）软件程序/系统之下开发和部署新的软件系统。 这意味着任何新的软件架构都必须考虑并与已运行的软件系统共存。
>Brownfield development is a term commonly used in the information technology industry to describe problem spaces needing the development and deployment of new software systems in the immediate presence of existing (legacy) software applications/systems. This implies that any new software architecture must take into account and coexist with live software already in situ. In contemporary civil engineering, Brownfield land means places where new buildings may need to be designed and erected considering the other structures and services already in place.

**红地：**软件系统进入维护期，并且不再开发新功能，只修复终端用户所发现的Bug，维护一段时间后，可能从此进入消亡期，不久后会被新系统所取代。

绿地与黄地的快速识别因素：是否考虑遗留系统的集成、共存。黄地与红地的快速识别因素：所维护的系统是否只修复Bug，不考虑增加新功能，或已经有计划会被取代。当快速区分项目的类型后，那么就可以根据项目的类型来设置度量指标：

### 三种项目类型的推荐指标

**绿地推荐指标：**相比其它类型，绿地项目研发团队是最可能接近项目终端用户，最可能开展端到端度量的，同时此类型的项目没有“历史包袱”，可以正常的进行架构设计，技术栈选择，在正常开销下完成部署流水线、线上监控告警、回滚、灾备等必要的线上保障措施。可选择 **辅助决策、工程能力** 这两类指标为首要指标，关注端到端的价值流，同时保证项目初期就将良好的工程实践落地。可选择 **规划进度、快速反馈** 为次要指标，辅助端到端价值流度量的达成。

首要指标和次要指标之间一般会相互影响，相互印证，次要指标的改善会带来首要指标的改善（比如：**快速反馈-代码签审时长** 的改善，会带来**辅助决策-前置时长** 的改善。）如果提升首要指标不好下手，可从次要指标开始。此时的 fuzzy front end 可定义为：终端用户向团队提出了某个需求的那一刻，可将用户需求被明确记录的那一刻认定为 lead time 的开始。

**黄地推荐指标：**项目已上线一段时间，有不少终端用户，并且要在原有系统上进行设计和开发，团队需要背负一定的“历史包袱”，架构和工程实践可能已经开始腐化。可选择 **规划进度、工程能力** 这两类指标为首要指标，关注交付任务的进度、架构和工程能力的改善，当工程能力提升后，会带来交付的加速。可选择 **辅助决策** 为次要指标，拓展功能交付所产生价值的度量，促进端到端的价值流度量。[中篇](/posts/finding-the-right-performance-metrics-two/) 提到的：**可持续扩展的度量，才可能驱动价值流的增效**，是一个有效技法。此时的 fuzzy front end 可定义为：在业务交给开发的那一刻，故事卡得到了明确定义。

根据以往经验，接手此类项目一般会有很多协调和沟通工作，“谷仓” ([The Silo Effect](https://en.wikipedia.org/wiki/Information_silo){:target="_blank"}) 严重，一开始就想从需求源头度量比较困难，从交付延展至价值度量是一个更合适的方式。同时此类型的项目还伴随着自上而下的变革诉求（尤其发生在畅销的、长生命周期的产品项目上），此时可加入 **团队转型、快速反馈** 这两类指标为首要指标，协助完成变革诉求。

**红地推荐指标：**软件系统上线多年，稳定服务于终端用户，不再开发新功能，只修复Bug，可能不久后会被新系统所取代。产品团队很可能不想再投入更多的资源改善系统，只要能把重要的Bug修复，每个季度发布一次就行。可选择 **规划进度** 为首要指标，保证有良好的 Bug 修复吞吐量。如果产品团队希望增加部署频率，加快响应终端用户的Bug诉求，可选择 **快速反馈** 为次要指标，帮助加速发布周期从而快速响应终端用户的Bug诉求。此时的  fuzzy front end 可定义为：终端用户将 Bug 清晰地报告给客服人员的那一刻。

**指标的选择和团队的上下文强相关，需根据团队具体的上下文来选择推荐的指标集，并裁剪指标集中的具体指标。**

![基于项目类型的效能指标推荐图](/assets/attachments/2021/11/18_124653_fcd72133dd02.png)
_基于项目类型的效能指标推荐图_

### 度量债与治理

伴随度量的开展和深入，项目同时也经历了一段时间的发展(由绿转黄，或由黄转红)，你可能会得到一个宝贵的顿悟时刻：**度量债**，绿地不开始度量，项目发展到了黄地或者红地的时候想度量了，就需要实现原来的度量（债务），拖延的时间越久相比一开始就度量所付出的代价就越高（利息）。

这两个特点非常类似现实中的债务，和常常提到的 **技术债** 也很相似。比如：系统想分析和统计一个请求在各个阶段所花费的时长从而进行优化，在最初的设计和实现时，不想花成本，牺牲未来的度量需求，满足当下的快速上线，没有为请求做一个TraceID，或者Tag、Bag，这样的属性，让其可以跟随请求经过各个系统，做好序列化和反序列化，那么当你想度量请求耗时的时候，很可能只能在请求端记录一个发出时间和返回时间，中间各个系统的处理时长基本无法获取和分析。

当你想加这个信息的时候，会发现牵连的系统太多了(网关, 反向代理, 服务 A、B、C、..., 消息队列, 数据库，等)，工作量太大，甚至有些系统你可能还不知道。度量也类似：当项目还是绿地阶段，干系人较少，需求评审和设计流程短，此时牺牲度量需求，只管功能上线，没有统计终端用户的需求创建时间、需求评审和设计时间，只统计了故事卡被交给开发的那一刻，随着项目发展 (尤其是盈利项目，战略项目，需求和规模快速扩大的项目)，干系人增多，需求评审和设计流程加长，此时再想统计终端用户的需求创建时间、需求评审和设计时间，可能你已无法知道故事卡在传给开发之前都经历了那些流程和阶段，所以此时再想度量，就会比绿地时所花费的代价大得多。

**如何治理度量债？**由于和技术债的相似性，可以借鉴技术债的治理方法，尽量只留下：谨慎故意的、谨慎无心的度量债。借鉴 Martin Fowler 的 [Tech debt quadrant](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html){:target="_blank"}.

![度量债](/assets/attachments/2021/11/18_125154_1e4623232389.png)

当你向团队提议说:“咱们来度量一下研发效能吧，看看有没有什么可以改善的?” 可能会得到下面的回答：

* “我们没时间进行度量，就这样吧！”，此时团队是鲁莽并且故意的，团队知道这样做是会欠债，然而并不清楚欠了债的具体后果，这种情况可以增加流程、负责人来作为提醒。
* “我们知道要度量，但是等这次发布之后就开始吧。”，此时团队是谨慎并且故意的，团队知道这样做是会欠债，而且也知道欠了债的具体后果，这种情况基本无法避免。
* “什么是度量？怎么度量？”，此时团队是鲁莽并且无心的，团队不清楚什么是度量，不清楚如何进行度量，这种情况需要补充能力。
* “现在我们终于知道该怎么度量了！”此时团队是谨慎并且无心的，团队知道度量这件事，但当时没有人知道如何度量，直到现在才明白如何度量。 这种情况无法避免。

全篇回顾：

* [上篇](/posts/finding-the-right-performance-metrics-one/){:target="_blank"} 回答了为什么最近几年软件研发效能会成为行业热词，有哪些合适的效能度量指标。
* [中篇](/posts/finding-the-right-performance-metrics-two/){:target="_blank"}分析了软件研发效能度量过程中的案例和观察，提出了三个观点和建议。
* 本篇 总结了根据软件项目类型的研发效能指标推荐图，和度量债的治理方法。

---

### 附录

#### 规划进度
评估进度，获取背景信息和上下文，知道任务何时完成，预测问题（未来），对问题复盘与回顾（过去）。

* 燃尽图 (每个迭代/每个发布) （Burn down chart sprint/release)
* 速率图 (Velocity chart)
* 标准差 (Standard deviation)
* 吞吐量（Throughput)
* 累积流程图 (Cumulative flow diagram)
* 控制图 (Control chart)
* 看板 在制品限制图 (Kanban WIP board)

---

#### 快速反馈
持续集成，持续部署。

* 构建与部署速度 (Build & Deploy speed)
* 测试速度 (Test speed)
* 代码签审时长 (PR approval Time)
* 单元测试通过速率 (Unit tests passed)
* 集成测试通过速率 (Integration tests passed)

---

#### 团队转型
使用特定指标来衡量不同工作方式的方法，可以影响行为，帮助改变人们的行为方式。也可以向管理层说明某些事情不合理，需要改变，或者说明需要更多的时间和预算。

* 结对编程的时长 (Pairing Time)
* 手工测试的时长  (Time spent manual testing)
* 代码签审时长 (PR approval Time)
* 修复失败构建的耗时 (Fix red build time)
* 修复Bug的耗时 (Cost of fixing bug in Dev/Prod)
* 测试覆盖率 (Coverage test count)
* 功效分配比率 (Effort allocation, New work / Unplanned work or rework / Other work)

---

#### 辅助决策
可进行实验并不断寻找新的度量指标，帮助做决策。

* 前置时长 (Lead time)
* 发布出去的Bug数 (Escaped bugs 线上逃逸Bug数)
* 功效分配比率 (Effort allocation, New work / Unplanned work or rework / Other work)
* 交付的价值 (Valued delivered)

---

#### 工程能力
4 key metrics 度量并找出团队工程实践的弱点。

* 变更前置时长 (Lead Time for Changes)
* 部署频率 (Deployment Frequency)
* 变更失败率 (Change Failure Rate)
* 服务恢复耗时 (Time to restore service)

[**公司微信公众号发布**](https://mp.weixin.qq.com/s/qxIs-FsbiPpMe465dUM56A){:target="_blank"}
