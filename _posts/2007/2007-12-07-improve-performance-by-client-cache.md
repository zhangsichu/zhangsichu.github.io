---
title: 如何利用客户端缓存对网站进行优化
date: 2007-12-07 10:31:09 + 0080
category: [Web开发]
tags: [Web, Debugging, Performance]
---

### 介绍  

你的网站在并发访问很大并且无法承受压力的情况下，你会选择如何优化？ 

很多人首先会想从服务器缓存方面着手对程序进行优化。许多不同的服务器缓存方式都有他们自己的特点。像我曾经参与的一些项目中，根据缓存的命中率不同使用过 `Com+/Enterprise Libiary` `Caching/Windows` 服务，静态文件等方式的服务器端缓存和 `HTTP Compression` 技术。但客户端缓存往往却被人们忽略了，即使服务器的缓存让你的页面访问起来非常地快。但她依然需要依赖浏览器下载并输出，而当你加入客户端缓存时，会给你带来非常多的好处。因为她可以对站点中访问最频繁的页进行缓存充分地提高 Web 服务器的吞吐量（通常以每秒的请求数计算）以提升应用程序性能和可伸缩性。   

一个在线购物调查显示，大多数人愿意去商店排队，但在在线购物时却不愿意等待。**Websense** 调查公司称多达70%的上网者表示不愿意在页面读取上超过10秒钟。超过 **70%** 的人会因为中途速度过慢而取消当前的订单。  

### 基础知识

1) 什么是`Last-Modified`?   

在浏览器第一次请求某一个URL时，服务器端的返回状态会是200，内容是你请求的资源，同时有一个`Last-Modified` 的属性标记此文件在服务期端最后被修改的时间，格式类似这样：   
`Last-Modified: Fri, 12 May 2006 18:53:33 GMT`  

客户端第二次请求此 `URL` 时，根据 `HTTP` 协议的规定，浏览器会向服务器传送 `If-Modified-Since` 报头，询问该时间之后文件是否有被修改过：   
`If-Modified-Since: Fri, 12 May 2006 18:53:33 GMT`

如果服务器端的资源没有变化，则自动返回 `HTTP 304 (Not Changed.)` 状态码，内容为空，这样就节省了传输数据量。当服务器端代码发生改变或者重启服务器时，则重新发出资源，返回和第一次请求时类似。从而保证不向客户端重复发出资源，也保证当服务器有变化时，客户端能够得到最新的资源。   

2) 什么是`Etag`?   

`HTTP` 协议规格说明定义 `ETag` 为 “被请求变量的实体值” （参见 ―― 章节 14.19）。 另一种说法是，`ETag` 是一个可以与 Web 资源关联的记号 `token`。典型的 Web 资源可以一个 Web 页，但也可能是 `JSON` 或 `XML` 文档。服务器单独负责判断记号是什么及其含义，并在HTTP响应头中将其传送到客户端，以下是服务器端返回的格式：
`ETag: "50b1c1d4f775c61:df3"`   

客户端的查询更新格式是这样的：   
`If-None-Match: W/"50b1c1d4f775c61:df3"`  

如果 `ETag` 没改变，则返回状态 `304` 然后不返回，这也和 `Last-Modified` 一样。本人测试 `Etag` 主要在断点下载时比较有用。  

### 利用Last-Modified和Etags提升性能

聪明的开发者会把 `Last-Modified` 和 `ETags` 请求的 `http` 报头一起使用，这样可利用客户端（例如浏览器）的缓存。因为服务器首先产生 `Last-Modified/Etag` 标记，服务器可在稍后使用它来判断页面是否已经被修改。本质上，客户端通过将该记号传回服务器要求服务器验证其（客户端）缓存。   
过程如下:  
1. 客户端请求一个页面（A）。   
2. 服务器返回页面A，并在给A加上一个`Last-Modified/ETag`。   
3. 客户端展现该页面，并将页面连同`Last-Modified/ETag`一起缓存。   
4. 客户再次请求页面A，并将上次请求时服务器返回的`Last-Modified/ETag`一起传递给服务器。   
5. 服务器检查该Last-Modified或ETag，并判断出该页面自上次客户端请求之后还未被修改，直接返回响应`304` 和一个空的响应体。  

示例代码
下面的例子描述如何使用服务器端代码去操作客户端缓存:  

```c#
//默认缓存的秒数  
int secondsTime = 100;   

//判断最后修改时间是否在要求的时间内  
//如果服务器端的文件没有被修改过，则返回状态是304，内容为空，这样就节省了传输数据量。如果服务器端的文件被修改过，则返回和第一次请求时类似。  
if (request.Headers["If-Modified-Since"] != null && TimeSpan.FromTicks(DateTime.Now.Ticks - DateTime.Parse(request.Headers["If-Modified-Since"]).Ticks).Seconds < secondsTime)  
{  
    //测试代码,在这里会发现,当浏览器返回304状态时,下面的日期并不会输出  
    Response.Write(DateTime.Now);  

    response.StatusCode = 304;  
    response.Headers.Add("Content-Encoding", "gzip");  
    response.StatusDescription = "Not Modified";  
}  
else  
{  
    //输出当前时间  
    Response.Write(DateTime.Now);  

    //设置客户端缓存状态  
    SetClientCaching(response, DateTime.Now);  
}  


/// <summary>  
/// 设置客户端缓存状态  
/// </summary>  
/// <param name="response"></param>  
/// <param name="lastModified"></param>  
private void SetClientCaching(HttpResponse response, DateTime lastModified)  
{  
    response.Cache.SetETag(lastModified.Ticks.ToString());  
    response.Cache.SetLastModified(lastModified);  
    //public 以指定响应能由客户端和共享（代理）缓存进行缓存。  
    response.Cache.SetCacheability(HttpCacheability.Public);  
    //是允许文档在被视为陈旧之前存在的最长绝对时间。  
    response.Cache.SetMaxAge(new TimeSpan(7, 0, 0, 0));  
    //将缓存过期从绝对时间设置为可调时间  
    response.Cache.SetSlidingExpiration(true);  
}  
```
如果你的缓存是基于文件的方式，如`XML`或`http`中的`.ashx`处理,也可以使用下面的基于文件方式的客户端缓存:   

```c#
/// <summary>  
/// 基于文件方式设置客户端缓存  
/// </summary>  
/// <param name="fileName"></param>  
private void SetFileCaching(HttpResponse response, string fileName)  
{  
    response.AddFileDependency(fileName);  
    //基于处理程序文件依赖项的时间戳设置 ETag HTTP 标头。   
    response.Cache.SetETagFromFileDependencies();  
    //基于处理程序文件依赖项的时间戳设置 Last-Modified HTTP 标头。  
    response.Cache.SetLastModifiedFromFileDependencies();  
    response.Cache.SetCacheability(HttpCacheability.Public);  
    response.Cache.SetMaxAge(new TimeSpan(7, 0, 0, 0));  
    response.Cache.SetSlidingExpiration(true);  
}  
```

使用后的效果如下图所示:  

![cache](/assets/attachments/2007/12/07_103909_tqiwclientcachingdemo.jpg)  

上图所使用的工具是在 IE 下运行的 `HttpWatchPro` 在 Firefox 下可以使用 `FireBug+YSlow` 进行测试。`YSlow` 是建立在 `FireBug` 基础上运行的一个小工具，它可以对你的网页进行分析为什么缓存，并给出评分和缓慢的原因。 这个工具来自Yahoo的研发团队，所以规则也是Yahoo制定的。

### 结论 
我们已经看了如何使用客户端缓存减少带宽和计算的方法，如前所述，如果能正确合理的利用各种不同的缓存，他们会给你带来很多的好处。