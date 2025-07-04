---
title: 使用Img.Src跨域请求
date: 2008-01-20 23:20:49 + 0080
category: [Web开发]
tags: [Web, Debugging, Design]
---

无刷新的页面请求，被越来越多的应用。`XMLHttp.Request` 只支持同域名的请求，`Iframe` 支持跨域请求，但是跨域 `Javascript` 调用会被制止，使得 `Iframe` 跨域请求没有办法做到 `CallBack`。`Script.Src` 的请求可以跨域，也可以写一个比较复杂的 `Script` 机制让它 `CallBack`，这几种实现方式都是比较重的。在一些场景下需要一个小巧的跨域请求。比如统计某个 `A href` 链接被点击了几次，某个图片被点击了几次。在这种场景下发送到服务器的数据量小，客户 `Script` 不关心服务器返回结果的内容，只关心这次请求是否成功。在这种场景下完全可以使用 `Img.Src` 做异步跨域请求。  

**应用场景**

假设有个点击统计服务器： `http://CountHits.Com` 它后面有数据库统计每天某个链接被点击了几次。它对外提供的REST访问接口是：  
`vender=venderID&href=urlHref&text=urlText&target=urlTarget&style=urlStyle&location=pageLocation&refere=pageRefere`   

`vender` 表示当前统计的投放者。 `location` 链接所在的页面。 `refere` 当前页面的来源页面。 如果统计成功返回 `200` 状态码，如果统计失败返回`500`状态码。 

根据这样的 `REST-URL` 接口,使用 `Img.src` 发送点击统计请求。  

1) 只为某个链接加统计，失败时重试3次：  

```js
function countClick(item) { 
    // create Img  
    item = item!=null && item.tagName ? item : this; 
    var image = document.createElement("IMG");  
    image.src = "http://CountHits.Com/Handler.ashx?vender=0&href="+encodeURIComponent(item.href)+"&text="+encodeURIComponent(item.innerHTML)+"&target="+encodeURIComponent(item.target)+"&style="+encodeURIComponent(item.style.cssText)+"&location="+encodeURIComponent(window.location.href) +"&referrer=" + encodeURIComponent(document.referrer) + "&t="+ new Date().getTime();

    image.height = 0; 
    image.width = 0; 
    item.requestTimes = item.requestTimes ? item.requestTimes ++ : 0; 
    
    image.onerror = Function.createDelegate(item, retry); 
    image.onload = Function.createDelegate(item, clean); 

    //send request.  
    document.body.appendChild(image); 
    return true;   
}  

function retry() {  
    if(this.requestTimes < 3) {  
        this.requestTimes ++;  
        countClick(this); 
    }  
    else  
    {  
        this.requestTimes = 0; 
    }  
}  

function clean() {  
    this.requestTimes = 0; 
}

Function.prototype.createDelegate = function(instance, method) { 
    return function() { 
        return method.apply(instance, arguments); 
    }
}
```  

```html
<a href="https://www.zhangsichu.com" onclick="countClick(this)" target="_blank">Test</a>  
```

2) 给所有链接加统计，失败时重试3次：  

```js
function AddEventHandle(target,eventType,handler)  
{  
    if(target.AddEventListener)  
    {  
        target.AddEventListener(eventType,handler,false); 
    }  
    else if(target.AttachEvent)  
    {  
        target.AttachEvent("on"+eventType,handler); 
    }  
    else  
    {  
        target["on"+eventType]=handler;  
    }  
}  

function RemoveEventHandle(target,eventType,handler)  
{  
    if(target.RemoveEventListener)  
    {  
        target.RemoveEventListener(eventType,handler); 
    }  
    else if(target.DetachEvent)  
    {  
        target.DetachEvent("on"+eventType,handler)  
    }  
    else  
    {  
        target["on"+evnetType]=null;  
    }  
}  

function window_onload() { 
    var links = document.getElementsByTagName("A"); 
    
    //debugger;  
    for(var i=0; i<links.length; i++) 
    {  
        AddEventHandle(links[i] , "click", Function.createDelegate(links[i], countClick));  
    }  
}  
```

3) 服务器端输出代码  

```c#
public class Handler : IHttpHandler {  
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "image/gif"; 
        System.Drawing.Bitmap image = new System.Drawing.Bitmap(1,1); 
        image.Save(context.Response.OutputStream, System.Drawing.Imaging.ImageFormat.Gif); 
    }  

    public bool IsReusable {  
        get {
            return false;  
        }  
    }  
}  
```  

[**源代码**](/assets/attachments/2008/01/20_232133_pmesTest.rar)
