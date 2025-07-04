---
title: Axure + Ionic 开发移动应用 - 构建页面架构
date: 2015-08-03 15:45:35 + 0080
category: [Web开发]
tags: [Web, Design, Mobile]
---

接上一篇系列文章，在本文中，将继续介绍在 WebStorm 中开发，去实现App的功能需求。 就像盖房子一样，第一步需要把整个工程的页面结构先勾勒出来，先让各个页面流转起来，然后再去细化每个页面。  

所有工程代码放在了 https://github.com/zhangsichu/DeliveryApp 同时上篇文章中创建的初始化工程，也`Tag`了 `TheInitialProject`，您可以使用 `Git checkout` 这个 `Tag`, 也可以直接到: https://github.com/zhangsichu/DeliveryApp/releases/tag/TheInitialProject 去下载初始化的工程代码，得到最初的 `ionic` 创建好的工程。 `git checkout TheInitialProject  `

在本App中，咱们采用了 `Ionic` `作为基础的工程框架，Ionic` 是基于 `AngularJS` 来构建的，所以第一步就是先把页面路由和URL设定好。创建工程的 `service` 和 `controller，并在` `app.js` 添加路由设定。 咱们在 `AngularJS` 中 `ng-app` 的名字取名为 `ddApp`.   

### 添加 `services.js` 和 `controllers.js`
1. 在 `service.js` 下声明 `ddApp.services` `Module`
```js
angular.module("ddApp.services", []);
```
1. 在`controller.js`下声明 `ddApp.controllers` `Module`
```js
angular.module("ddApp.controllers", ["ddApp.services"])
```
1. 在 `app.js` 添加 `Module` 依赖
```js 
angular.module("ddApp", ["ionic", "ddApp.services", "ddApp.controllers"])
```
1. 在 `index.html` 中添加 `Javascript` 文件引用
```html 
<script src="js/app.js"></script>  
<script src="js/services.js"></script>  
<script src="js/controllers.js"></script>  
```
![code view](/assets/attachments/2015/08/04_141133_he8l1.png)  
到这一步您可以执行以下 `ionic serve` 在浏览器里看看现在的页面情况  

### 添加路由和功能页面 
1. 在 `app.js` 里添加 `app` 的路由。  
![app code](/assets/attachments/2015/08/04_145009_yvn32.png)  
代码很简单，设定 `App` 中 `Url` 对应的状态，和对应要访问的页面，同时也需在 `www` 目录下创建 `templates` 文件夹和对应的页面文件。  
1. 修改 `controller.js` 添加空的 `Controller`  
当 `templates` 下对应的 `html` 创建完成后，需要在` controllers.js` 下为每个页面先写一个空的 `controller`，稍后我们会去实现实际的业务功能。  
![control view](/assets/attachments/2015/08/04_145018_pmes3.png)  
1. 修改 `index.html`  
修改 `App` 为` navigate view`  
![navigate view](/assets/attachments/2015/08/04_145044_qnfu4.png)  

到这一步您可以执行以下 `ionic serve` 在浏览器里访问 http://localhost:8100/#/login 看看效果。  

### 让页面动起来   
功能页面都创建好了，现在就要在页面里写功能了，让页面动起来了。给每个页面添加按钮，在对应的 `Controller` 里添加功能代码。如在 `Login` 页面里 添加 `login` 按钮，给它添加功能。  
```html
<h1>Login</h1>  
<button ng-click="doLogin();">登陆</button>
```

在 `Controller` 里添加页面跳转的功能。  
![controller redirect](/assets/attachments/2015/08/04_160100_oldr5.png)  

页面最后完成的样子。  
![final view](/assets/attachments/2015/08/04_160216_fc5jdone.gif)  

到这一步完成的代码在[**这里**](https://github.com/zhangsichu/DeliveryApp/releases/tag/AllPages){:target="_blank"}，您也可以执行 `git checkout AllPages` 获得这一步的源代码。
