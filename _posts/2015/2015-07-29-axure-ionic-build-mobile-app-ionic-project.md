---
title: Axure + Ionic 开发移动应用 - 创建项目
date: 2015-07-29 15:08:08 + 0080
category: [Web开发]
tags: [Web, Design, Mobile]
---

[Ionic](https://ionicframework.com/) 是什么? Ionic 是目前最有潜力的一款 `HTML5` 手机应用开发框架。通过 `SASS` 构建应用程序，它提供了很多 `UI` 组件来帮助开发者开发强大的应用。 它使用 `JavaScript` `MVVM` 框架和 `AngularJS` 来增强应用。提供数据的双向绑定，使用它成为 `Web` 和移动开发者的共同选择。  

Ionic 在发布了 1.0 版本以后，被越来越多的关注和支持，社区也十分的活跃。本文将继续上篇，使用 Ionic 框架来开发应用。

1) 首先安装 NodeJs：https://nodejs.org/ 在NodeJs 网站上找到自己平台的安装包，执行安装即可。    
2) 安装 Ionic：http://www.ionicframework.com/getting-started/ 执行命令。 `npm install -g cordova ionic` 

在 `Mac` 下安装的时候，可能会出现没有权限的问题。提升权限执行 `sudo` 即可: `sudo npm install -g cordova ionic ` 

Ionic 有三种默认项目模板：  
1. blank - 空工程模板，  
1. tabs - 分页Tabs工程模板  
1. sidemenu - 左边菜单工程模板  

![ionic project](/assets/attachments/2015/07/03_152335_c02f1.png)  
  
3) 使用 `ionic start DeliveryApp blank` 创建这个 App 应用 DeliveryApp 是咱们这个实例的项目名称。  
![ionic blank](/assets/attachments/2015/07/03_152635_gd6k2.png)
_ionic start DeliveryApp blank_

4) 运行 ionic serve 看一下在网页中的模拟效果。  
`ionic serve`
![run project](/assets/attachments/2015/07/03_152711_if8m32.png)  

5) 给这个应用添加发布平台，这里添加了 `Android` 平台和 `iOS` 平台。    
`cordova platform add android`   
![cordova in android](/assets/attachments/2015/07/03_153211_xum15.png)  
`cordova emulate android`   
![cordova in iandroid](/assets/attachments/2015/07/03_153409_kh0n6.png)  
`cordova platform add ios`  
![cordova in ios](/assets/attachments/2015/07/03_153502_3zr64.png)  
`ionic emulate ios`   
![cordova in ios](/assets/attachments/2015/07/03_153557_eb4h7.png)  

到这里 ionic 就搭建完成了。 下一步下载 WebStorm，使用WebStorm作为开发的IDE吧。 
  
6) WebStorm 开发环境   
WebStorm 下载地址：https://www.jetbrains.com/webstorm/ 下载并安装 WebStorm 安装完成后，使用   WebStorm 打开文件夹 DeliverApp。  
![WebStorm](/assets/attachments/2015/07/03_154108_b91e8.png)  

截止到现在基于 ionic 的工程搭建好了，开发需要使用的 WebStorm 弄好了。下篇我们可以开始按照 Axure 里的需求开发每个页面了。（本文最终完成的工程代码会放在 github上） 
