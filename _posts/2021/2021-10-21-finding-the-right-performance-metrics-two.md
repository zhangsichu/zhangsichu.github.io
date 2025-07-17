---
title: 寻找合适的研发效能度量指标（中）
date: 2021-10-21 21:32:21 + 0080
category: [研发效能]
tags: [演讲, Software Development, Product]
image: /assets/attachments/2021/10/21_111744_e76911232362.jpg
---

[上篇](/posts/finding-the-right-performance-metrics-one/)，咱们尝试回答了最近几年 “软件研发效能” 为什么会成为业界的热词 “Buzzword” ，有哪些合适的软件研发效能度量指标这两个问题。[下篇](/posts/finding-the-right-performance-metrics-three/) 希望根据业务的情况，界定的团队上下文，给出一些推荐的度量指标。为了让这些内容更加有上下文和代入感，这里加入本文作为中篇，在本篇里聊聊我在一线开发过程中对效能的三个观察和观点。

### 观察和观点一：莫让度量变目标。

经济学家 [查尔斯·古德哈特](https://zh.wikipedia.org/wiki/%E6%9F%A5%E5%B0%94%E6%96%AF%C2%B7%E5%8F%A4%E5%BE%B7%E5%93%88%E7%89%B9){:target="_blank"} 在1975提出了 [古德哈特定律](https://zh.wikipedia.org/wiki/%E5%8F%A4%E5%BE%B7%E5%93%88%E7%89%B9%E5%AE%9A%E5%BE%8B){:target="_blank"}: **When a measure becomes a target, it ceases to be a good measure.**  “当一个度量本身成为目标时，它就不再是一个好的度量”。根据我们在项目中的观察和经验，古德哈特定律不光适用于经济学领域，一样适用于软件研发领域。

此定律在现实中的故事: 在法国殖民时期的越南，鼠患成灾，所以当地政府想出办法: 鼓励民众一起动手灭鼠并奖励灭鼠的民众，民众只需要上交死老鼠的尾巴就可以获得奖励。不久之后，越南的街头就出现了没有尾巴的老鼠，人们为了持续盈利，并没有杀死老鼠，而只是切下它的尾巴，等待它去生新老鼠给自己赚钱。

在正常情况下，「被切下的老鼠尾巴的数量」与「死去老鼠的数量」正相关，是一个好的指标。可是，一旦政府把「被切下的老鼠尾巴的数量」变成大家的优化目标，就会产生未曾预料到的结果。简单来说，这种度量变成了目标，驱动并产生了“上有政策，下有对策。”

在软件研发领域里，当你度量团队产出的代码行数并设置目标时，比如: 800行/人天，聪明的程序员，就会被驱动去优化「代码行数」并让它达到目标。比如: 多加点中间变量，多加点注释，多抽点方法和测试，目标不就达成了吗? (曾见过方法实现只有两行代码，注释20多行，而且在工程里经常看到类似的注释和方法。) 这种目标度量会给业务带来价值吗?

再比如你度量并设置团队每个迭代需要完成Story的点数或者个数的时候，比如: 20点/迭代，团队就会被驱动优化「Story点数」并让它达到目标。比如: BA和Dev在开迭代计划会议的时候多估算一点，多拆一些卡，目标不就达成了吗？(曾听到有团队的卡墙上有一张三个点的Team Building卡。 Create DB这种操作原来估1个点，现在估3个点。为了不影响**Cycle time**的统计, 由于第三方依赖阻塞的卡，阻塞不好推动，也不想持续识别并推动了，移回**Backlog**。) 这种目标度量会给业务带来价值吗？它是否可以落实到具体的管理或技术实践中？

**让度量指标和数据收集尽量真实，需要关注的是趋势和阻塞。**在上面的案例里，统计每个迭代完成的卡，需要观察其趋势，一般情况下，每个迭代完成的卡，会在一个合理的区间内波动。(好比：用听诊器测量每分钟的心跳，非运动状态在 [60~100bpm 次/分钟](https://zh.wikipedia.org/wiki/%E5%BF%83%E7%8E%87){:target="_blank"} 都属于正常。) 观察趋势并识别阻塞和阻塞的原因，加以针对性的治理，从而加速卡的流动，是度量的意义。而不是简单的和其他团队比较，粗狂的设定一个目标，驱使团队产生未曾预料的结果。

![Iteration throughput](/assets/attachments/2021/10/21_114934_431764064083.webp)
_某团队24个迭代所完成故事点统计图_

上图是一个项目24个迭代，每个迭代完成故事卡点数的统计图。由于团队所工作的业务领域没有变化，团队在此业务领域越来越熟练，所以总体交付趋势逐渐是上升的，交付速率逐步在一个合理区间内波动。观察并分析交付点数波动较大的迭代，分析并采取行动：

* 迭代7到迭代8，单个故事卡过大，拆卡质量不高，沟通复杂性增加，单卡开发时长增加，速率下降。行动：开发人员与业务分析师紧密沟通，在工作开始时将其拆解成更独立，更小的故事卡。
* 迭代14到迭代15，由于开发过程中所依赖的第三方API出现问题，无法按时对接，有累计超过10个点的卡延迟交付，不能贡献给本迭代，但会在下个迭代第三方API完工后完成，并体现在下个迭代。行动：及时的沟通和追踪依赖系统的情况并进行开发任务的调整，防止阻塞与等待的发生。

### 观察和观点二：无法拆解的度量指标，可能不是一个好的度量指标。

可拆解的指标和结果才是一个好的指标。变更前置时长 (Lead time for change) 或者需求交付时长，是一个很好的指标，能帮助并促进价值流的交付。但是你只是捕获需求提出的时间点和需求上线的时间点，并计算这两个点之间的耗时以此进行度量和阻塞识别，这是非常困难的，因为跨度太大，包括的因素太多，你很难看清楚到底发生了什么，到底在哪个阶段什么因素导致了阻塞。

[杜邦分析法](https://en.wikipedia.org/wiki/DuPont_analysis){:target="_blank"} 就是问题拆解的经典应用，拆解某个不容易看清楚的大问题到若干个子问题，通过分析若干子问题从而解决原来的大问题。比如分析并优化股本回报率这个一下看不清楚的大问题，拆解: 股本回报率（ROE）= 利润率 × 资产周转率 × **权益乘数** = (净收入 / 营业收入) × (营业收入 / 资产) × (资产/ 股东权益)

从而将无法直接分析和优化的股本回报率，变得更容易分析和优化，同时再次钻取这些子问题，直到找出一个个更加显而易见的指标。

![杜邦分析模型](/assets/attachments/2021/10/21_115352_e1426403d20.webp)
_[杜邦分析模型](https://en.wikipedia.org/wiki/DuPont_analysis)_

![杜邦分析图](/assets/attachments/2021/10/21_115352_f3234dfspt10.webp)
_[杜邦分析图](https://wiki.mbalib.com/wiki/%E6%9D%9C%E9%82%A6%E5%88%86%E6%9E%90%E5%9B%BE)_

那么为什么可以借鉴杜邦分析法来拆解研发效能？因为研发效能也是一个不容易看清楚的大问题，需要拆解到若干个子问题，通过分析若干子问题从而解决原来的大问题，同时它是一个可分阶段度量拆解的指标，并且每阶段都可以再次细分、拆解。

![需求交付时长的拆解](/assets/attachments/2021/10/21_115945_a2e6sc2274.png)

如上图，一个需求交付时长的拆解，通过不断的拆解找到更细化、具体的指标，找到优化点。

需求从提出到上线总花费时长为：21.5天 (工作日)=需求分析时长(2.5天)+需求设计时长(3.2天)+Backlog等待(0天)+需求交付时长(15.8天)；需求交付时长(15.8天)=团队研发时长(7.7天)/研发并行效率(48.5%)，如果只有一个团队，并行效率为100%；团队研发时长(7.7天)=需求开发时长(3.6天)+需求测试时长(1.3天)+发布前测试时长(1.2天)+金丝雀发布时长(1.1天)+全量发布时长(0.5天)。

在上个迭代找类似大小的需求，同样拆解各个工序指标的时长、占比，从趋势角度观察各个指标是上升了还是下降了。如果上升了，比如需求设计时长(3.2天)比上迭代类似大小需求的占比上升了2.18%，原因是什么，是否需要注意并改进什么? 由于这次的一个需求点没有分析透彻，导致了设计多次反馈修改，耗时加长。

行动：对于需求分析的产出增加更明确的检查列表，保证需求在送入设计之前已经被分析透彻了。所以当一个度量指标是一个可拆解的指标，它才可能是一个可落地到管理实践、技术实践的好指标。

### 观察和观点三：可持续扩展的度量，才可能驱动价值流的增效。

研发效能的度量经常从一个比较全局的指标开始，因为比较全局的指标，能更直观的体现交付价值，比如：上文的 需求交付时长，但是不容易直观的看到问题，需要不断拆解，以此找到明确的问题点，把改进行动落地到管理实践、技术实践。与此同时指标也可以从局部开始，通过不断的扩展，驱动价值流增效。例如：起始的度量指标是《[Accelerate](https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations/dp/1942788339){:target="_blank"}》中的 **Lead time**, 度量从代码提交到部署到生产环境的时长。

原文第二章 Measuring Performance:
>The elevation of lead time as a metric is a key element of Lean theory. **Lead time is the time it takes to go from a customer making a request to the request being satisfied** . However, in the context of product development, where we aim to satisfy multiple customers in ways they may not anticipate, there are two parts to lead time: the time it takes to design and validate a product or feature, and the time to deliver the feature to customers. **In the design part of the lead time, it’s often unclear when to start the clock, and often there is high variability.** For this reason, Reinertsen calls this part of the lead time the “fuzzy front end” (Reinertsen 2009). However, **the delivery part of the lead time—the time it takes for work to be implemented, tested, and delivered—is easier to measure and has a lower variability.** 

原文说明了完整的 lead time 是从客户提出需求到功能上线、需求被满足的时间，但是由于需求分析、设计的起始时间不确定性大，难以统计，所以从确定性大的交付阶段开始统计，同时《[Accelerate](https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations/dp/1942788339){:target="_blank"}》这本书也是主打DevOps工程实践，更关注此方面的度量和指标。可以从这个指标开始，但是不应就此停留在这一阶段，这一阶段的耗时少了，说明团队的工程实践强，有完善的CI/CD，但不一定快速的响应了客户的需求。所以需要持续扩展度量，驱动价值流增效。

实际案例：团队度量了 lead time for change: 10分钟左右就从代码提交部署到生产环境了，但是观察发现一个功能的好几个代码提交等了几天才被部署，后来发现这些代码提交后进入了 pull request review，需要被客户团队review，但是客户团队并没有及时的 review 且合并 master 主分支，没有触发 pipeline，所以等了几天。团队可以自行 review 和 merge 的 pull request 都被很快的 review 合并了。此时团队扩展 lead time for change 的度量，起始时间从合并到主分支这个时间点，左移到 pull request 里的第一个提交，通过度量找到了和客户团队合作 pull request review 过程中可以优化的点，加速 pull request 的过程。

后来 lead time for change 的起始时间又被进一步左移，移动到了Story卡被移进 开发 列的时间，当Story被移进 开发 列就代表此功能的 lead time for change 开始计时了，从而了解开发过程中是否有和BA、QA沟通中的阻塞，有可优化的点。如果开发的功能被 feature toggle 所保护，在代码提交并部署上线后，feature toggle 没有被打开，也可以将 lead time 的结束时间右移，计算为feature toggle打开的时间点，可以分析是否业务决策的时间过长影响了功能上线。

以上的三个观察和观点：
* **莫让度量变目标。让度量指标和数据收集尽量真实，需要关注的是趋势和阻塞。**
* **无法拆解的度量指标，可能不是一个好的度量指标。**
* **可持续扩展的度量，才可能驱动价值流的增效。**

希望能在您使用研发效能的指标与度量过程中带来帮助，通过设定的指标和对应的度量，找到软件研发过程中的阻塞，从而制定对应的行动，有效的落地到管理实践和技术实践。

[**公司微信公众号发布**](https://mp.weixin.qq.com/s/QyiauXmHjf8AMxoZDmgCJw){:target="_blank"}
