---
title: 一套内容采集系统
date: 2011-02-08 16:31:56 + 0080
category: [Web开发]
tags: [Web, GUI, Software Development, C#, 大制作]
---

内容采集系统，对于以内容为主的网站来说是非常好的助手，除了原创内容外，其它内容需要编辑人员或者采集系统来收集整理，然后添加到自己的网站里。**Discuz** **DvBBS** **CMS** 等产品，内部都自带了一个内容采集功能，来采集指定的相关内容。 单客户端的火车头采集器也可以非常好的采集指定的内容。这些工具都是想让机器代替人工，把编辑人员从内容搬运的工作中解放出来，做一些更高端的工作，例如采集结果的内容微调，SEO优化，设定精确的采集规则，让采集的内容更加符合自己网站的需要。  

下面的内容采集系统就是从这个想法开发而来的，这个采集系统由两个部分组成：  
1. 编辑人员所使用的采集规则设定器和对采集结果进行审核、微调和发布所使用的Web站点。  
2. 部署在服务器上的定时采集器和定时发送器。  

首先由编辑人员通过一个采集规则设定器 `NiceCollectoer.exe` 设定要采集的站点，再等采集完成后，编辑人员再通过一个 Web 站点 `PickWeb` 对采集的结果进行审核、微调和优化然后发布到自己的网站上。编辑人员所需要做的是采集规则的设定，和对采集结果的优化，其它部分的工作都由机器完成。  

![solution](/assets/attachments/2011/02/08_162734_fc6j8.gif)  

`NicePicker` 是 `Html` 分析器，用来抽取 `Url`，`NiceCollector` 和 `HostCollector` 都使用 `NicePicker` 来分 析 `Html`， `NiceCollectoer` 就是采集规则设定器，一个目标网站只用设定一次:  

![main form](/assets/attachments/2011/02/08_162806_if8l2.gif)  

![pages](/assets/attachments/2011/02/08_162822_db4h1.gif)  

使用起来和最早的火车头采集器类似，这里使用博客园来做目标采集站点， 设定采集精华区的文章，采集规则非常简单：当编辑人员设定好采集规则后，这些规则会保存到 `NiceCollector.exe` 同目录下的 `Setting.mdb` 中。一般当采集规则设定好以后，基本上不用再变动了，只在目标网站的Html `Dom` 结构发生变化时，需要再次微调一下采集规则。`NiceCollector` 同时用于新目标采集站点的设定和添加操作。  

等编辑人员完成采集规则的设定后，把`Setting.mdb` 放到 `HostCollector.exe` 下， `HostCollector` 会根据 `Setting.mdb` 的设定进行真正的采集，并把采集的结果存入数据库。  
到这一步就完成了内容的采集工作，编辑人员可以打开PickWeb，对采集结果进行微调和优化，然后审核通过并发送到自己的网站上：  

![pick up web](/assets/attachments/2011/02/08_162904_vsky3.gif)  

![pick up web](/assets/attachments/2011/02/08_162924_a8zd4.gif)  

真正发送采集结果到自己网站的工作不是由`PickWeb`完成的，编辑人员完成内容审核后，`PostToForum.exe` 会读取数据库并发送这条通过审核的采集结果到自己的网站上，在自己的网站上当然需要一个`.ashx`或者某种其它方式来接收采集的结果，不建议`PostToFormu.exe`直接去操作自己网站的数据库，最好通过自己网站上的某个`API`，来接收采集结果。  

`NiceCollectoer`, `HostCollector`, `PickWeb`, `PostToForum`, 这几个程序联合工作，基本上已经完成了采集和发送的工作，`HostCollector`, `PickWeb`, `PostToForum` 是部署在服务器上的，`HostCollector` 需要被周期性的调用，来采集目标网站所产生的新内容，`HostRunnerService.exe` 是一个 `Windows Service`，用来周期性调用 `HostCollector`，使用管理员身份在控制台下运行 `installutil / i HostRunnerService.exe 就可以安装这个Windows Service` 了：  

![windows services](/assets/attachments/2011/02/08_162945_c02g7.gif)  

**HostRunnerService** 的配置也很简单:  

![runner settings](/assets/attachments/2011/02/08_163006_vsky6.gif)  

在 `RunTime.txt` 中设定每天定时采集几次：  

![runner settings](/assets/attachments/2011/02/08_163025_sphv5.gif)  

当新内容被采集后，编辑人员需要定期的登录 `PickWeb`，来优化、微调、并审核新内容，也可以设定默认审核通过。同样 `PostToForum` 也需要被周期性的调用，用来发送审核通过的新内容，`CallSenderService.exe` 与 `HostRunnerService.exe` 类似，也是一个 `Windows Service`,用来定期的调用 `PostToFormu.exe`。  

到这里整个系统基本上完成了，除此之外还有两个小东东: `SelfChecker.exe` 和 `HealthChecker.exe`。 `SelfCheck.exe` 是用来检查 `Setting.mdb` 中设定的规则是否是一个有效的规则，例如检查采集规则是否设定了内容采集项。`HealthChecker.exe` 用来收集 `HostCollector.exe` 和 `PostToForum.exe` 所产生的log，然后将 `log` 发送给指定的系统维护人员。  

这个内容采集系统还有很多地方需要改进和优化，现在的状态只能说是个 **Prototype** 吧，例如 **NicePick** 需要进一步抽象和重构，给出更多的 `Interface`，把分析 `Html` 的各个环节插件化，在各个分析步骤上，可以让用户加载自己的分析器。 在 `NiceCollector` 上，需要更多更全面的采集规则设定。在 `PickWeb` 上可以加入一些默认的SEO优化规则，如批量SEO优化 **Title** 的内容，等其它方面吧。  

[**执行文件**](/assets/attachments/2011/02/08_453455_if8l_NROutput.rar)     
[**源代码**](/assets/attachments/2011/02/08_234324_if8l_NiceCollector.rar)  

