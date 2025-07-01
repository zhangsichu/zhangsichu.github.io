---
title: Baidu 悄悄的做了些什么
date: 2007-10-18 22:40:48 + 0080
category: [Web开发]
tags: [Web, Software Development]
---

今天访问baidu的时候，fiddler正好开着。发现截获的http请求中有两个请求比较奇怪。如下图：  

![net traffic](/assets/attachments/2007/10/18_223749_urjybd1.gif)  

其中的第3个请求和第4个请求。请求的地址都比较长。  
第3个请求的地址是 `http://c.baidu.com/c.gif?t=0&q=%B2%E2%CA%D4&p=0&pn=1`  
第4个请求的地址是 `http://s.baidu.com/w.gif?path=http://www.baidu.com/s?wd=%B2%E2%CA%D4&cl=3&t=1192698536690`  
这两个请求都是要求获得一个`gif`图片。但是都带了参数。请求图片带参数。第3个请求的状态码是`204`表示无内容。第4个请求的状态码是 `200` 表示请求正常。可是发现这两个请求返回的`Content-Length`都是 `0`。表明服务器没有返回给用户任何`gif`图片的数据。在 baidu 的 `html` 中找到了这两个图片  

![pic](/assets/attachments/2007/10/18_223752_nkcqbd2.gif)  

就是这两个`style=”display:none”`的`img`，其中一个`img`是用`javascript`动态用`document.write`写入的。  
由于这两个图片的`style=”display:none”`说明这两个图片是永远不会被显示出来的。那么这两个图片在这里到底有什么用呢。  
可能这个问题只有baidu知道。

在baidu搜索了一些其它的关键字，这两个隐藏的img依然存在。看来这两个没有内容的图片，每一个页面都会去请求。在baidu搜索结果返回的html中，每个搜索到的链接都带了类似相同的onclick事件处理。  

![html](/assets/attachments/2007/10/18_223756_jg9nbd3.gif)  

都是` onclick=”return c(***,this.innerHTML,this.href,*)”`  都调用`c`方法。  
`Javascript c` 方法的内容：

```js    
function c(e,b,u,s,p,t){if(document.images){var p=window.document.location.href;var t=new Date().getTime();b=b.replace(/<[^<>]+>/g, "");(new Image()).src="http://s.baidu.com/w.gif?query=%B2%E2%CA%D4&e="+e+"&title="+b+"&url="+escape(u)+"&spos="+s+"&path="+p+"&t="+t;}return true;}  
```  

`Javascript c`方法`new`了一个`Image`。设置这个`Image`的`src`为`http://s.baidu.com/w.gif?query=%B2%E2%CA%D4&e="+e+"&title="+b+"&url="+escape(u)+"&spos="+s+"&path="+p+"&t="+t;`  
当点击 `link`。`onclick`事件被触发。这个`src`地址被请求。  

![net traffic](/assets/attachments/2007/10/18_223801_if8lbd4.gif)   

请求的结果还是一个没有内容的图片。  

看到这里，最前面那两个没有返回内容的图片请求，应该和这个请求做了类似的事。这个请求应该是通过参数`post`到服务器为这个链接记录点击次数，因为在点击链接时这个`javascript`才会被触发，才会发出这个请求。服务器通过记录搜索结果中每个链接的点击次数，从而决定每个链接在搜索结果中的排名顺序。那么前面的两个请求也应该是用这种方式来`post`参数到服务器。让服务器记录下些什么。  

为什么baidu要使用这样的方式给服务器发数据呢。一般使用 `<script src=”http://xxx.com/api.aspx?para1=value1&para2=value” ></script>` 这种方式发数据给服务器。服务器还可以返回一段 Javascript 操作 Dom。同时服务器也不需要做特殊的设置。这里 baidu 访问了一个 `.gif` 地址。由于请求的是一个`.gif`，默认图片的链接，服务器默认会去取一张图片。不会经过 `Web` 服务器端的 `Module` 和 `Handle`来处理。在这里服务器上应该用了 `Url Rewrite` 技术或者直接指定了 `.gif` 为一个特殊的扩展名，有个特殊的 `Handle` 来处理。  

究竟baidu为什么要用`img`的`src`来`post`数据给服务器？是要绕过`XmlHttpRequest`的跨域问题，是只`Post`不关心返回内容，而不使用`script`的`src`来`post`数据，估计这只有baidu自己知道吧。  

google 也做了类似这样的事情。不过 google 比百度记录的要多。  
google 不光统计点击，甚至记录了用户是否在某个搜索结果的链接上悬停过。鼠标在某个区域活动的比较多。  
用户鼠标移动的顺序位置。  
google 的 `Script` 混淆后比较难懂 `http://www.google.cn/extern_js/f/CgV6aC1DThICY24rMAo4ASw/TXlNyPshIOk.js`   

