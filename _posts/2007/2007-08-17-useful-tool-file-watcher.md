---
title: 实用小工具FileWatcher
date: 2007-08-17 11:27:51 + 0080
category: [.Net/Java]
tags: [C#, GUI, Software Development]
---

**FileWatcher** 观察或检视某个指定文件夹中的文件或子文件夹是否被变动过。  
在一些工作场景中需要监视某个文件夹被变动的情况，记录成日志。如监视一个存放数据库文件的文件夹，或者存放重要Word文档的文件夹。`FileWatcher` 就是这样的小工具，监视某个指定的文件夹的变动情况，并记录日志。  

配置文件中有3个Key:
```xml
<appSettings>
    <add key="watchFolder" value="D:\DB" /> <!--指定要监视的文件夹-->
    <add key="logFileName" value="D:\Changes.txt" /> <!-- 生成Log文件的位置 --> 
    <add key="watchFilter" value="" /> <!-- 要监视文件的过滤器 如 *.txt监视 .txt文件 默认空表示监视 *.* 所有文件  -->
</appSettings>
```

FileWatcher有两个版本  
1. FileWatcher 控制台。需要程序一直在运行。适合临时监控场景使用。监控行为只有在程序运行时有效。  
2. FileWatcherService Windows Service。适合服务器长期监视场景使用。启动后自动开启服务，实行监视。  

安装 Service 的命令，`InstallUtil.exe FileWatcherService.exe` InstallUtil.exe 在`%WINDIR%\Microsoft.NET\Framework\v2.0.50727` 下。  

[**源代码**](/assets/attachments/2007/08/17_113033_1xp4Watcher.rar)

