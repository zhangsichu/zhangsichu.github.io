---
title: 小结在制作MergeModule和Setup时遇到的问题
date: 2007-02-01 14:12:47 + 0080
category: [.Net/Java]
tags: [C#, Debugging, GUI, Software Development]
---

客户要求，制作一个`MergeModule`。用这个`MergeModule`制作一个Setup。要求当用户的操作系统是Vista时弹出一个对话框提示用户一些信息。如果不是Vista不提示任何信息。从微软的MSDN看到的方案是做一个弹出信息的Dll 或Exe的CustomAction, 放在Custom Actions里的Install里。用这个方法作的`MergeModule`和Setup在Windows2003和Xp下都没有问题。可是在Vista下一运行，Setup总是意外中断。不知道什么原因。后来搜索微软的帮助文档也没有找到答案。CustomActions中有Install Commit Rollback Uninstall 4种Action提供了4个时机为Setup扩展。Install不成功，换Commit。其实对Commit是否能成功也是试试看。换成Commit后在Windows 2003 Xp Vista下都没有问题了。都成功了。  

从这次`MergeModule`的制作有3个收获：  
1. 当Setup程序出错时很不好调试。软软提供了一个调试方法：`msiexec /i yoursetup.msi /l*v C:\setuplog.txt`。在log中可以看到很详细的安装信息。如果出错会有出错的地点，和错误返回码，帮助调查问题。  
1. 如果`MergeModule`要支持Vista最好不要在CustomActions的Install中作扩展。  
1. 不要加`MergeModule`的Output到Setup的`MergeModule`中。最好加一个已经Build好的`MergeModule`到Setup中。 

