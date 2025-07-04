---
title: 打包Asp.Net 网站成为一个exe 方便快捷的进行客户演示
date: 2011-02-06 00:31:46 + 0080
category: [Web开发]
tags: [C#, Web, Software Development, 大制作]
---

在 `Asp` 时代有一个 `NetBox` 产品可以把整个 `Asp` 网站 `AllInOne` 的打包成一个 `exe`，在没有 `IIS` 的情况下可以单独运行这个exe来开启整个网站。在 `Asp.Net` 下一直没有类似的产品出现，可能是 `IIS` 已经非常的强大了，不需要类似的产品了? 但是在某种场景下还是需要一个类似功能的产品的，这个产品不是用来部分替代 `IIS` 来做一个轻量级的IIS，而是用来方便快捷的进行客户展示。  

例如，当完成一个网站开发后，或者部分完成开发后，想给客户展示一下，收集一下客户的反馈，一般有两种做法：  
1. 自己有主机和域名，把网站发布到Internet 上，让用户通过Internet访问网站。  
2. 把网站部署到一台笔记本上，让一名工程师带着网站到客户那里收集客户反馈。  

结合 `NetBox` 的思想是否可以把整个网站打包成一个 `exe`，尽量把相关的东西都 `AllInOne` 到一个 `exe` 里，这样给客户演示的时候，就可以直接把这个 `exe` 发给用户，用户直接运行这个 `exe `就可以看到网站的实现的情况了，这样做是否又给网站演示增加了一种新的手段。  

`Jelly.Packer.exe` 就是从这个想法而开发出来的打包程序，把整个网站打包成一个 `AllInOne` 的 `exe`，然后将打包生成的 `exe` 发给客户做演示。  

![main settings](/assets/attachments/2011/02/06_002541_c02fPacker.gif)  

**主要配置**
1. `Home Directory` 要打包网站所在的位置，某个你已经编译好的要发布的站点的文件夹，一般是Visual Studio站点 publish输出的文件夹。  
1. `Virtual Directory` 站点虚拟路径，一般使用 “/”， 如果你打包了两个站点，想在同一端口运行，可以使用虚拟路径来区分。
1. `List Directory` 在没有默认页面的时候，是否允许列出目录。
1. `Authentication` 是否要求安全身份访问。
1. `Auto Show` 是否自动开启站点，并同时开启默认浏览器访问此站点。
1. `Default Files` 站点默认页面。

当配置好上面的属性后，点 **OK** 后，就会在 `Jelly.Packer.exe` 同目录下生成一个 `Jelly.SingleRunner.exe`，这个`Jelly.SingleRunner.exe` 就是指定网站 `AllInOne` 所打包好的 `exe`，可以将这个 `exe` 发给客户做演示。  

![running](/assets/attachments/2011/02/06_002724_gd6jPackFinished.gif)  

当运行`Jelly.SingleRunner.exe` 后，会在刚刚` Jelly.Packer.exe` 所设置的端口上开启指定的网站:  

![control pannel](/assets/attachments/2011/02/06_002743_yvn2SingleRunner.gif)  

![control pannel](/assets/attachments/2011/02/06_002811_c02fSingleRunnerBar.gif)  

最初曾经考虑过把一个轻型的`web server`，网站，和一个轻型浏览器打包在一起，这样就不需要占用端口了，就像MSDN帮助手册的 ms-help 协议那样来实现，后来考虑到需要让多个浏览器都可以访问，同时也可以把这个演示站点公开发布到本地局域网里，让客户本地网络里的别的机器也可以访问，基于这种需求，把轻型 `web server` 和网站打包在一起，可能是比较好的选择吧。  

如果需要商业合作，或者特殊定制，请联系: zhangsichu@gmail.com 欢迎意见反馈。   

[**打包程序**](/assets/attachments/2011/02/06_003955_khaoJellyPacker.rar)  

[**把 BlogEngine V2.0 打包成了 exe**](/assets/attachments/2011/02/06_033955_blogRngineJellyRunner.rar)

 **源代码 + 技术说明文档 + 一年电话技术支持 售价为:2999**  

