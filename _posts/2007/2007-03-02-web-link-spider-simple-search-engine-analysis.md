---
title: WebLinkSpider 简单搜索引擎分析
date: 2007-03-02 16:08:14 + 0080
category: [.Net/Java]
tags: [Web, C#, Database, GUI, 大制作]
image:
  path: /assets/attachments/2007/03/03_144520_52t8weblinkspider.gif
  show_top: false
---

**WebLinkSpider** 网络爬虫。很多网站都会发现，经常有搜索引擎在访问自己的网站。搜索引擎访问网站是为了采集这个网站的信息，为搜索引擎提供内容服务。这种爬虫就是从页面中的一个链接跳到另一链接就这样一次又一次的跳，收集每个页面的信息，存储起来，为搜索引擎提供内容服务。

有了这些内容，当用户进行搜索的时候，搜索引擎从中找到相关的内容，把对应的Url和相关的内容返回给用。就完成了一个简单的搜索。

现在大型的搜索引擎都不把爬虫采集来的信息放在数据库中。因为数据库在分布式处理 网格计算 负载平衡 上的表现都不是很满意。存储的信息一般都以文件的形式来存放。然后再这些内容上进行全文检索，这样的全文检索对网格计算和负载平衡支持的很好。  

Luncene 是这种搜索技术的代表开源项目。  

Apache Lucene https://lucene.apache.org/java/docs/   
Apache Lucene is a high-performance, full-featured text search engine library written entirely in Java. It is a technology suitable for nearly any application that requires full-text search, especially cross-platform.  
Apache Lucene is an open source project available for free download.  

Dot Lucene https://www.dotlucene.net/  
Base on M$ .Net Lucene also open source.  

Lucene China https://www.lucene.com.cn/yanli.htm  
China Lucene.  

大型的搜索引擎中还加入了分词和语义解析的功能，使得搜索更方便，得到结果更加符合搜索的意图。  
自己也根据搜索引擎的工作方式，写了一个爬虫 :) 采集来的数据放在 SQL Server中。使用动态规划 动态剪枝 提高采集性能。  
支持以Single形式运行和以Service形式运行。  

**LinkInfo.xml 是采集配置信息**
```xml
<Link>  
    <StartUrl>https://www.tom.com</StartUrl>  
    <UrlText><![CDATA[Tom 首页]]></UrlText>  
    <WantedDepth>10</WantedDepth>  
    <MaxDepth>1000</MaxDepth>  
    <StartTime>22:50:00</StartTime>  
    <AllowMinuteSpan>5</AllowMinuteSpan>  
    <Timeout>10675190</Timeout>  
</Link>
```

 **StartUrl 采集站点的起始Url**
1. UrlText 本Url的描述信息。可以不写。  
1. WantedDepth 想要采集的深度，`-1` 表示无限深。  
1. MaxDepth 当WantedDepth =-1时的限制深度。  
1. AllowMinuteSpan 当以Service启动时，检查时间允许的误差。单位分钟。  
1. Timeout 当这个网站采集消耗的时间超过Timeout设定的时间时，中止采集。  
1. StartTime 在以Service运行的情况下，当当前的时间等于StartTime时运行这个采集Link。当以Single模式运行时。StartTime没有用。 

**DBInfo.xml 数据库链接信息**
```xml
 <?xml version="1.0" encoding="utf-8" ?>  
<WebLinkSpiderDBInfo Name="NiceWebSpider" Author="www.xdnice.com" Copyright="xdnice" Url="http://www.xdnice.com" Description="Web Link Spider Application Setting" version="1.0.0">  
    <ConnectionString>Data Source=Localhost\SQLEXPRESS;Initial Catalog=Test_DB;Integrated Security=True</ConnectionString>
</WebLinkSpiderDBInfo>
```  
 **ConnectionString 数据库链接信息**   
SpiderService.exe.config Service配置信息  
```xml
<add key="CheckPeriod" value="300000"/>  
<add key="WebLinkSpiderExeName" value="WebLinkSpider.exe" />  
 ```
1. CheckPeriod 服务检查的周期  
1. WebLinkSpiderExeName 爬虫程序的名字

**4个网站10层深度爬的结果** 
![Result](/assets/attachments/2007/03/03_144520_52t8weblinkspider.gif)  

[**源代码**](/assets/attachments/2007/03/02_174435_vskzWebLinkSpider.rar)  
