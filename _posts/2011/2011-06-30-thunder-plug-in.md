---
title: 迅雷应用开发
date: 2011-06-30 21:50:11 + 0080
category: [.Net/Java]
tags: [C#, Debugging, Design]
---

**360**上市了，同时**周鸿祎**也暗示自己投资的另一家公司也要上市，业界都在猜测是否是迅雷。但是又有传闻说美国会拿迅雷上市开刀，以知识产权来影响中国互联网企业上市的门槛。  

最近迅雷也开放了自己的下载引擎，使得用户不需要安装迅雷，也可以使用迅雷引擎来进行下载。围绕着迅雷做开发，利用迅雷下载的资源优势，和逐渐壮大的迅雷雷友社区来创造增值，应该是迅雷开放自己下载引擎的目的。围绕迅雷做开发大体上有三种:  
1. 使用迅雷的开放引擎`XLDownload.dll`做开发。  
2. 使用迅雷的`ThunderAgent.dll`, `COM`组件做`Agent`开发。  
3. 使用`Lua`在迅雷内部做应用插件开发。  

**Reference:** 
1. http://thunderplatform.xunlei.com/
1. http://xldoc.xl7.xunlei.com/

### 使用迅雷的开放引擎`XLDownload.dll`做开发  
在`XLDownload.dll`的 `.h` 头文件里给出了` XLDownload.dll` 提供的功能:  
```c
BOOL __stdcall XLInitDownloadEngine();  
DWORD __stdcall XLURLDownloadToFile(LPCTSTR pszFileName, LPCTSTR pszUrl, LPCTSTR pszRefUrl, LONG & lTaskId);  
DWORD __stdcall XLQueryTaskInfo(LONG lTaskId, LONG *plStatus, ULONGLONG *pullFileSize, ULONGLONG *pullRecvSize);  
DWORD __stdcall XLPauseTask(LONG lTaskId, LONG & lNewTaskId);  
DWORD __stdcall XLContinueTask(LONG lTaskId);  
DWORD __stdcall XLContinueTaskFromTdFile(LPCTSTR pszTdFileFullPath, LONG & lTaskId);  
VOID __stdcall XLStopTask(LONG lTaskId);  
BOOL __stdcall XLUninitDownloadEngine();  
DWORD __stdcall XLGetErrorMsg(DWORD dwErrorId, LPTSTR pszBuffer, DWORD & dwSize);  

enum enumTaskStatus{  
    enumTaskStatus_Connect = 0, // 已经建立连接  
    enumTaskStatus_Download = 2, // 开始下载   
    enumTaskStatus_Pause = 10, // 暂停  
    enumTaskStatus_Success = 11, // 成功下载  
    enumTaskStatus_Fail = 12, // 下载失败  
};  
```

根据这9个函数，可以使用`.Net` `DllImport` 一下，开发出一个基于迅雷引擎的下载工具：  
![DllImport](/assets/attachments/2011/06/30_143532_tqixBOpen.gif)  

迅雷的开放引擎在被调用时，会在系统托盘里弹出提示信息，告诉用户正在使用迅雷开放引擎下载：  
![Tray download](/assets/attachments/2011/06/30_143556_he8lBOpen1.gif)  

这个版本的开放下载引擎稍有遗憾，好像只支持Http协议的资源，迅雷本协议的资源并不支持下载。这个让人很是遗憾。  

### 使用迅雷的`ThunderAgent.dll` `COM` 组件做 Agent 开发  
安装完迅雷后，在迅雷的BHO文件夹下会找到ThunderAgent.dll，.Net 工程加载这个dll后，会看到Agent内部的API：
![BHO](/assets/attachments/2011/06/30_143615_ob4iBCom1.gif)  

使用 `Agent` 开发迅雷应用，迅雷必须安装，调用 `AddTask` 后会弹出迅雷的提示框:  
![Agent download](/assets/attachments/2011/06/30_143632_gd6kBCom.gif)  

需要用户自己点击“立即下载”。可以使用FindWindow, SendMessage, 类似自动测试常用的办法点击“立即下载”。  

### 使用Lua在迅雷内部做应用插件开发
`Lua` 作为内嵌语言来做插件开发已经非常成熟了，最为著名的应该算暴雪的《魔兽世界》和其它各大游戏厂商都在使用Lua作为自己游戏的插件开发语言。迅雷也选用 `Lua` 作为自己的插件开发语言。使用Lua可以快速方便的开发出一个迅雷应用插件：
![BHo](/assets/attachments/2011/06/31_101310_if8lBM4.gif)  

这个 Blog&Music 迅雷插件想在迅雷里一边看博客，一边听音乐。点击插件，会新开一个Tab页载入博客:  
![Plug in](/assets/attachments/2011/06/30_143725_85waBM2.gif)  

同时在下载状态栏里载入一个音乐播放器:  
![Plug in load](/assets/attachments/2011/06/30_143740_wtlzBM3.gif)  

这样就可以在迅雷里一边看博客，一边听音乐了。 :)  

安装插件时，把 `BlogMusic` 文件夹拷贝到 `ProgramData\Thunder Network\addins\` 下，同时删除 `addins_cache.xml`，清除插件的 `cache`，重新打开迅雷就可以看到这个插件了。  

这个插件没有什么实际意义，只是学习迅雷插件的开发。  
迅雷在线文档给出了`Lua` 可调用的API: http://xldoc.xl7.xunlei.com/  
迅雷阳台里有一些实用插件: http://yangtai.xunlei.com/  

上面大体是围绕迅雷做开发的三种方式，从这三种方式看，感觉迅雷的开放力度很小，迅雷的开放引擎不支持自己的协议，同时要在系统托盘提示用户在使用迅雷引擎。Lua可访问的API也并不多，而且还主要集中在UI上，看来迅雷对开放还是比较保守的。  

[**源代码**](/assets/attachments/2011/06/30_142381_amlwThunderDemo.rar)

