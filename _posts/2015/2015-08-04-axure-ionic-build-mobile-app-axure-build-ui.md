---
title: Axure + Ionic 开发移动应用 - 实现页面UI
date: 2015-08-04 10:10:46 + 0080
category: [.Net/Java]
tags: [Web, Design, Mobile]
---

接上一篇系列文章，在本文中，将在WebStorm中继续开发，实现页面的功能。这需要一个页面一个页面的开发，来完成功能。本文将侧重把所有页面的UI都实现出来，先把前端的工作都完成了，然后再去链接后端的 `RESTful Service`。  

### 登陆页面  
给页面添加 `login.html` 添加页面 `html` 代码。   
```html
<ion-view title="用户登录">
    <ion-content class="padding">
        <div class="login-title">
            <h2 class="energized">方便每一天</h2>
            <h2 class="assertive">配送系统</h2>
        </div>
        <div>
            <form novalidate="novalidate" on-valid-submit="doLogin()">
                <label class="item item-input validated">
                    <span class="input-label" for="account">账号</span>
                    <input id="account" type="text" ng-model="user.name" placeholder="账号" required="required" name="account" />
                    <i class="icon ion-alert-circled error"></i>
                </label>
                <label class="item item-input validated">
                    <span class="input-label" for="password">密码</span>
                    <input id="password" type="password" ng-model="user.password" placeholder="********" required="required" name="password" />
                    <i class="icon ion-alert-circled error"></i>
                </label>
                <label class="item">
                    <button type="submit" class="button button-block button-positive icon ion-person icon-text">登录</button>
                </label>
            </form>
        </div>
    </ion-content>
</ion-view>
```

为了实现，输入框的验证功能，需要给 `AngularJS` 加入两个自定义的标签: `on-valid-submit`, `validated` 由于这是一个全局的验证功能就把它添加到 `app.js` `ddApp` `module`下，如果只针对某个页面，可以只添加到这个页面的 `controller` 下，到这里登陆页面的UI就完成了。
![code view](/assets/attachments/2015/08/05_145558_mjcq1.png)  
![ui view](/assets/attachments/2015/08/05_134534_b91e2.gif)  

### 列表页面
首先构建派送列表页的`html`内容: 
```html 
<ion-view view-title="{{now | date:yyyy年M月d日}}">
    <ion-nav-bar class="bar bar-balanced" align-title="center">
        <ion-nav-buttons side="left">
            <li class="button icon icon-left ion-chevron-left" ng-click="doLogout()">退出</li>
        </ion-nav-buttons>
    </ion-nav-bar>
    <ion-content class="list order-list">
        <ion-item  class="item order-item" ng-repeat="order in orders">
            <img class="order-img" ng-src="{{order.qrSrc}}" ng-click="goDetail(order.id)" />
            <div class="order-text">
                <h2 ng-click="goDetail(order.id)">{{order.code}}</h2>
                <h3>{{order.pickTime}}</h3>
            </div>
            <div class="order-check" ng-click="goDetail(order.id)">
                <a class="button icon-right ion-chevron-right button-clear button-assertive"></a>
            </div>
        </ion-item >
    </ion-content>
    <div class="bar bar-footer bar-positive">
        <div class="button-bar">
            <li class="button icon ion-ios-keypad icon-text" ng-click="goManual()">手动输入</li>
            <li class="button icon ion-qr-scanner icon-text" ng-click="goScan()">扫描二维码</li>
        </div>
    </div>
</ion-view>
```
为了展示数据，这里在 `Service` 里做了一个 `MockDB` 使用这个 `MockDB` 为 `App` 提供数据，这样当请求使用后端数据的时候，只要后端的 `RESTful Service` 也返回同样规格的数据就可以了。  
![json mock DB](/assets/attachments/2015/08/05_145628_vsky2.png)  
这里代码比较多，具体代码在 `services.js` 中。  

接下来处理 派送列表 的 `controller` 把页面动作交互和数据连上：  
![controller code](/assets/attachments/2015/08/05_150020_zwo33.png)  

到这里派送列表页，就处理完了:  
![ui view](/assets/attachments/2015/08/05_162402_07yc3.gif)  

### 详细页面  
添加详细页面 `html` 代码:  
```html
<ion-view view-title="订单:{{data.code}}">
    <ion-nav-bar class="bar bar-positive" align-title="center">
        <ion-nav-buttons side="left">
            <li class="button icon icon-left ion-chevron-left" ng-click="goList()">返回</li>
        </ion-nav-buttons>
    </ion-nav-bar>
    <ion-content class="list order-detail">
        <div>
            <div class="qr-code-item">
                <img ng-src="{{data.qrSrc}}" />
                <h4> {{data.code}} </h4>
            </div>
            <div class="item item-stable item-icon-left">
                <i class="icon ion-compass icon-padding"></i> 配送地点: {{data.location}}
            </div>
            <div class="item item-light item-icon-left">
                <i class="icon ion-clock icon-padding"></i> 配送时间: {{data.pickTime}}
            </div>
            <div class="item item-stable item-icon-left">
                <i class="icon ion-social-yen-outline icon-padding"></i> 金额总计: {{data.total}}
            </div>
            <div class="item item-light item-icon-left">
                <i class="icon ion-ios-calendar-outline icon-padding"></i> 订单时间: {{data.date | date:'yyyy年MM月dd日'}}
            </div>
            <div class="item item-calm item-divider">
                订单明细
            </div>
        </div>
        <ion-item  class="item order-item" ng-repeat="order in data.orders">
            <img class="order-img" ng-src="{{order.src}}" ng-click="goDetail(order.id)" />
            <div class="order-text">
                <h2>{{order.name}}</h2>
                <h3>{{order.price}}元</h3>
            </div>
            <div class="order-detail-check" ng-click="goDetail(order.id)">
                <div class="order-detail-count">{{order.count}} 份</div>
            </div>
        </ion-item>
        <div class="padding">
            <button class="button button-block button-assertive icon ion-android-checkmark-circle icon-text" ng-click="doDone()">
                完成订单
            </button>
        </div>
    </ion-content>
</ion-view>
```   
添加页面 `controller` :  
![page controller](/assets/attachments/2015/08/05_171557_b91e4.png)  
到这一步 详细页面完成了:  
![final view](/assets/attachments/2015/08/05_172641_a8zd5.gif)  
  
接下来就是手动输入页面，和扫描页面，这两个页面比较简单，类似于前面的页面，写好页面 `html`，配置好 `controller` 的内容，就可以了。

到这里所有页面的 UI 都完成了。 代码在[**这里**](https://github.com/zhangsichu/DeliveryApp/releases/tag/AllPageUI){:target="_blank"}，您也可以使用 `git checkout AllPageUI` 取得。
