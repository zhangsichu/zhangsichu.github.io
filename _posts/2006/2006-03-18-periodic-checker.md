---
title: Periodic Checker
date: 2006-03-18 11:58:42 + 0080
category: [.Net/Java]
tags: [C#, Programming, GUI, Design, Software Development]
---

Periodic Checker 周期性检查器。 什么是周期性检查器？ 就是间隔一个预先设定的时间，就去检查某个特定的程序是否正常运行，如果没有正常运行就重新启动那个被监视的程序。听起来好像很奇怪，监视一个程序，重新启动那个被监视的程序？那看看下面的简明的流程图吧。 :)  

流程如下图:  
![Flow](/assets/attachments/2006/03/18_121859_fc5jperiodicchecker.gif)  

其实也是在一个很偶然的机会下，我想到了这个程序。有一次我发现某些不知道是干什么的程序，在系统任务管理栏中出现（我猜想可能是木马或者什么别的程序），结束这些程序的进程后，过了一会又出现了。我就猜想在这些程序后面，是不是还有一个程序负责在它们的进程被结束后，再次启动它们。我沿着这个想法就写了这个**Periodic Checker**。  
Period Checker 主要有下买几个部分:   
**1. ApplicationProcess**
`ProcessException`
`ProcessStatusEventArgs`
`ProcessStatusEventArgs`
`ApplicationProcess` 是一个应用程序包装器，它包装一个应用程序，它为 `PeriodicChecker` 提供这个应用程序的运行状态，为 `PeriodicChecker` 提供 `CheckAlive()` `ShutdownProcess()` `StartupProcess()` 这些方法，可以让 PeriodicChecker 方便的监视和控制这个应用程序。  

**2. PeriodicChecker**  
PeriodicChecker 周期的检查被监视的应用程序，PeriodicChecker内部有一个Timer, 间隔设定的时间后检查被监视的应用程序是否出问题，当Crash时抛出`ProcessCrashedEvent`事件。PeriodicChecker向外提供了`Start()` `Stop()` 这些方法，让PeriodicChecker 开始或停止对指定的应用程序进行监控。  

**3. LoadApplication**  
`LoadApplication` 站在最外面，它向最外面提供方法，它像一个组合器，加载一个应用程序，处理 PeriodicChecker 抛出的 `ProcessCrashedEvent` 事件，使PeriodicChecker完整的运行起来。  

 **下面来分析一下整个程序的流程吧** 
首先在声明一个LoadApplication的时候，会指定一个具体的Application，启动时的参数，间隔多少毫秒进行一次检查。如：`new LoadApplication("PeriodicApplication.exe","",false,5000)`, 当 `new LoadApplication后，会初始化 ApplicationProcess PeriodicChecker：
```c# 
this._checkPeriod = checkPeriod; 
this._applicationProcess = new ApplicationProcess(applicationName,applicationArgs,withPath); 
this._periodicChecker = new PeriodicChecker(this._applicationProcess); 
this._applicationProcess.ProcessStatusChangedEvent += new ApplicationProcess.ProcessStatusEventHandler(_applicationProcess_ProcessStatusChangedEvent); 
this._periodicChecker.ProcessCrashedEvent += new PeriodicChecker.ProcessStatusEventHandler(_periodicChecker_ProcessCrashedEvent); 
this._applicationProcess.StartupProcess(); 
```

 **处理ProcessCrashedEvent事件：**  
```c#
ApplicationProcess applicationProcess = (ApplicationProcess)((PeriodicChecker)sender).CheckedApplication; 
applicationProcess.Dispose(); 
applicationProcess.StartupProcess(); 
```

 **当PeriodicChecker发现有`ProcessStatusChangedEvent`会在ApplicationProcess Alive时启动PeriodicChecker, 非Alive时Stop PeriodicChecker**  
```c#
if(this._periodicChecker != null)  
{  
    if(e.Alive)  
    {  
        //Check the application.  
        this._periodicChecker.Start(this._checkPeriod); 
    }  
    else  
    {  
        this._periodicChecker.Stop(); 
    }  
}
```
**PeriodicChecker ApplicationProcess这两个类负责下面的一切处理。**  
ApplicationProcess 通过 Application 的 `ProcessID` 来监控当前的这个应用程序是否在运行，主要通过调用 `System.Diagnostics.Process.Start` `System.Diagnostics.Process.Kill` `System.Diagnostics.Process.GetProcessById` 这些方法来控制程序的运行。  
PeriodicChecker 提供 Start Stop 方法使 PeriodicCheck 开始或者停止对应用程序的监控。并在应用程序Crash的时候，抛出ProcessCrashedEvent事件。最后在LoadApplication中完成全局的控制。  

[**源代码**](/assets/attachments/2006/03/18_132616_a8zdPeriodicChecker.rar)
