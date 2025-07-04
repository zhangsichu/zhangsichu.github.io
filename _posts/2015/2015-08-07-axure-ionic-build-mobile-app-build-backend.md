---
title: Axure + Ionic 开发移动应用 - 迈向后端
date: 2015-08-07 11:44:34 + 0080
category: [Web开发]
tags: [Web, Design, Mobile]
---

接上一篇系列文章，在本文中将连接后端服务，实现用户登录功能，并去掉前端的`MockDB`，使用服务器端的数据。在迈向后端的同时，同时介绍如何使用`Chrome`跨域插件，在浏览器中请求跨域数据，模拟`App`的数据请求。服务器端选择了`NodeJS`的`Express`框架，很方便的就把原来的`MockDB`变成了服务器端的`RESTful Service`。  

### App后端服务端  
咱们选择了**Express**作为**App**的服务端技术，`Express` 需要先安装 `NodeJS`，在之前的 `Ionic` 安装部分，已经安装好了 `NodeJS`。接下来就是安装 `Express`了，`Express`的官方地： https://expressjs.com/ 安装方法非常简单，新建一个 `Server` 端的项目文件夹，比如 `DeliverAppServer`，然后控制台 `cd` 进入这个文件夹，执行 `npm install express --save` 就可以了。这里咱们主要去搭建一个模拟的 `Server` 端，这个 `Server` 端没有访问数据库，没有具体的业务逻辑，只是返回静态的JSON，目的是让 `App` 得到 `Http` 请求过来的数据。完成所有 `App` 的开发工作。 `npm install express --save`
![install express](/assets/attachments/2015/08/07_182007_41s71.png)  

接下来测试一下，新建一个` app.js` 写一个简单的 `HelloWorld`   
```js
var express = require(express);
var app = express();

app.get('/', function (req, res) {
  res.send(Hello World!);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log(Example app listening at http://%s:%s, host, port);
});
```  

然后执行：`node app.js`      
![run in console](/assets/attachments/2015/08/07_182100_kh0n2.png)      
![view in browser](/assets/attachments/2015/08/07_182105_2yq53.png)     
可以看到 `App` 的 `Server` 端已经开启了。接下来就可以开始实现 `Server` 端的 `RESTful API了`。`Express` 框架非常的简单易用，使用 `app.get` `app.post` 就可以实现一个 `Http` 的 `Method` 定义。如 `login` 这个定义：  

```js
app.post('/login', function (req, res) {
    res.json({success: true, data: {authenticationToken: 'abc01234567890defgh'}});
});
```  

`Http` 的 `Post` 方法，请求的 `Url是` `/login`，直接返回登陆成功信息。在实际的项目中，这个地方是后端的业务逻辑，根据请求中的用户名和密码去检查用户信息，这里是模拟后端服务，所以直接返回了登陆成功。`authenticationToke` 是用户登陆成功的令牌，在后面的每次 `Http` 请求中，都会带在 `Http` 请求的 `Header` 中，由于 `Http` 协议是无状态的，所以在每次请求中都带上 `authenticationToken`，服务器就知道当前访问的用户是谁了。如果 `Http Header` 中没有有效的 `authenticationToken` 也就是说明 `Http` 请求的是非法用户，需要返回 `403` 等其它状态码。  

所有的 `Server` 端 `RESTful API` 已经写好了，主要是把原来前端的`MockDB`，搬移到了后端，然后配置了`URL`路由信息，基本没有改动，已经放在了本文最后的下载链接里了，你可以直接下载，使用 `node app.js` 开启服务。  

### 前端重构
`services.js` 需要一些改动，需要删除 `MockDB`， 使用 `$http` 从后端取得数据，在`CommonService`中有一个`buildUrl`方法，只要填写相对`Url`就可以了，当`Server`端发布以后，可以方便的指向`Server`端实际的域名。  

`OrderService` 中的请求如 `all` 方法，直接使用: `return $http.get(CommonService.buildUrl(orders));`

就可以将原来的 `MockDB` 请求转向了`Http`的`Server`端请求。如果你使用 `ionic emulate ios`  

是可以直接访问的:  
![ios test](/assets/attachments/2015/08/07_184240_oldsa.gif)  

但是如果你使用浏览器来调试，你会在控制台看到浏览器的跨域请求拦截：  
![http request](/assets/attachments/2015/08/07_182241_96xb4.png)  

由于**W3C**的安全标准，**Web**的`HttpRequest`跨域请求，需要设置`Allow-Control-Allow-Origin`，由于咱们最后会发布一个单独的应用，所以没有浏览器的跨域限制。但是为了在浏览器里进行调试，所以需要暂时添加这个`Http Header`设置，`Chrome` 的插件可以解决这个问题：  
![chrome plugin](/assets/attachments/2015/08/07_182302_sphv5.png)  
安装好以后，在浏览器上会出现图标，打开此功能。  

这样数据就可以请求到后端了。其它`html`的代码和`controller`的代码基本不用变化，主要是吧`services.js`里的代码修改一下，直接使用$http去取得数据。为了实现需要登录后，才能看到页面的需求，要在 `app.run` 的里加入限定：  
```js
$rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
    if (AuthenticationService.isNeedLogin(toState.data) && !AuthenticationService.isLogin()) {
        event.preventDefault();
        $state.go('login');
    }
});
```  

这样当用户没有登录的时候，是不能访问其它页面的，会被重定向到 login， 到这里本系列文章就全部完结了。最终代码在[**这里**](https://github.com/zhangsichu/DeliveryApp/releases/tag/Final){:target="_blank"}， 也可以使用 `git checkout Final` 获得。

[**服务端app.js文件**](/assets/attachments/2015/08/07_182459_vskyapp.zip)
