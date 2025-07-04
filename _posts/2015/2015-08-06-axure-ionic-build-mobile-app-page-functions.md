---
title: Axure + Ionic 开发移动应用 - 实现页面功能
date: 2015-08-06 15:01:25 + 0080
category: [Web开发]
tags: [Web, Design, Mobile, Product]
---

接上一篇系列文章，在本文中，将进一步的去实现页面功能。去实现输入页面功能，二维码扫描功能。完成 App 的前端工作。  

### 输入页面  
当派送员输入订单号码的时候，首先检查一下单号是否有效，如果有效直接进入订单详情页面，如果无效则提示订单无效，提示用户重新输入。  
![input ui code](/assets/attachments/2015/08/06_145456_qnft0.png)  

最后完成的效果  
![ui view](/assets/attachments/2015/08/06_145538_gd6ji.gif)  

### 扫描二维码页面  
首先安装 `Barcode Scanner` 支持 http://ngcordova.com/docs/plugins/barcodeScanner/  
`cordova plugin add https://github.com/wildabeast/BarcodeScanner.git`
![add scanner plugin](/assets/attachments/2015/08/06_145630_wtlz1.png)  

然后安装 `ng-cordova` https://github.com/driftyco/ng-cordova/releases 下载 `javascript` 文件，将文件放到 `lib/angular` 下，并在 `index` 里引入 `ng-cordova` 的引用   
![add cordova](/assets/attachments/2015/08/06_145729_63u92.png)  

在 `app` 里 注入 `ngCordova`  
![add cordova](/assets/attachments/2015/08/06_145751_wtl13.png)  

最后就是使用 `$cordovaBarcodeScanner` 对象，分别处理扫描成功和失败的操作。  
![use scanner](/assets/attachments/2015/08/06_145810_gd6j4.png)  

由于扫描功能打开了一个单独的摄像头页面，在这个页面就可以完成扫描功能了，所以之前设计的扫描页面可以不用了。扫描功能需要连接实际的机器才能测试，模拟器不好测试扫描功能。    
![finalview](/assets/attachments/2015/08/08_011200_mjcqe.gif)  

到这里所有的页面基础功能就完成了，在下一篇中将连接后端服务，实现用户登录功能，并去掉前端的 `MockDB`，使用服务器端的数据。本阶段代码在[**这里**](https://github.com/zhangsichu/DeliveryApp/releases/tag/PageFunctions){:target="_blank"}，也可以 `git checkout PageFunctions` 取得。

