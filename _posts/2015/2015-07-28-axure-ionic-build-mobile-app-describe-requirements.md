---
title: Axure + Ionic 开发移动应用 - 描述需求
date: 2015-07-28 18:36:21 + 0080
category: [Web开发]
tags: [Web, Design, Mobile, Product]
---

本文将采用一个小的App为实例，开始讲述如何使用，[Axure](https://www.axure.com/) 做原型设计，使用 [Ionic](https://ionicframework.com/) 在 [WebStorm](https://www.jetbrains.com/webstorm/) 里做开发。从而帮您了解和入门 Web前端开发和 Ionic 的使用。

这是一个简单的应用，设想这样一个应用场景，有一个商家想做一个派送订单的客户端，从而让快递员，快速的进行订单配送。例如下图的这种**OTO**派送方式，一个个小格子，用户头一天定早餐，中午定午餐，平时定零食，下午茶，微信公众号订购，直接入住写字楼，App派送，二维码一扫，小柜子就打开了，很适合坐写字楼的上班族。  

![OTO cabinet](/assets/attachments/2015/07/07_232704_zwo4r.jpg)  
本文就设想这个OTO的派送App为实现目标, 使用 Axure做一个原型设计。  

如下图：  
1. 用户登陆，在登陆成功后，进入今日带处理订单列表。  
![design in Axure](/assets/attachments/2015/07/03_114251_gd6j1.png)

2. 在今日带处理列表中，用户可以选择一个系统已经指派好的派送任务。同时也可以执行：退出系统，手动输入或者扫描二维码进入一个派送任务。  
![design in Axure](/assets/attachments/2015/07/03_114316_xum12.png)  
![design in Axure](/assets/attachments/2015/07/03_114340_eb4i3.png)  
![design in Axure](/assets/attachments/2015/07/03_114358_96xc4.png)  

3. 点击一个派送任务，进入此派送任务，可以看到要派送的详细内容，当派送完成后，点击 完成订单，表示此订单配送完成。  
![design in Axure](/assets/attachments/2015/07/03_114415_85wa5.png)  

以上就使用 Axure 快速的完成了业务需求的描述，下篇将介绍，创建Ionic项目，并在 WebStorm 中开发。  
[**Axure 实例文件**](/assets/attachments/2015/07/03_114150_vskyDemo.zip)  

