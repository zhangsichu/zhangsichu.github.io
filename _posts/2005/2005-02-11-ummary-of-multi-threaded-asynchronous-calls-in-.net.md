---
title: .NET下多线程异步调用的小结
date: 2005-02-11 21:20:11 + 0800
category: [.Net/Java]
tags: [C#, Multithreading, 多线程, Programming]
---

最近看了看.NET异步调用方面的资料，现择重点总结，若有纰漏敬请指正。  

### 异步调用的实质  
异步调用通过委托将所需调用的方法置于一个新线程上运行，从而能够使一个可能需要较长时间的任务在后台执行而不影响调用方的其他行为。  

### 异步调用的实现  
前面已经说道，异步调用通过委托实现。委托支持同步和异步调用。在同步调用中，一个委托的实例可记录多个目标方法；在异步调用中，一个委托实例中有且只能包含一个目标方法。异步调用使用委托实例的BeginInvoke方法和EndInvoke方法分别开始调用和检索返回值，这两个方法在编译期生成。调用BeginInvoke后委托立即返回；调用EndInvoke时倘若委托方法未执行完毕，则阻塞当前线程至调用完毕。  
假设有一个委托  

 **`public delegate int ASyncHandler(int a,string b,ref string c);`**  
那么，其BeginInvoke与EndInvoke的形式如下：  

 **`public IAsyncResult BeginInvoke(int a,string b,ref string c,AsyncCallback callback,object asyncState);`**  

 **`public int EndInvoke(ref string c,IAsyncResult asyncResult);`**  
也就是说，BeginInvoke与EndInvoke的参数列表与当前委托签名有关，可以总结为：  

 **`public IAsyncResult BeginInvoke(委托所具有的全部参数，AsyncCallback callback,object asyncState);`**  

`public 委托返回值 EndInvoke(委托参数中ref/out部分,IAsyncResult asyncResult);`  
`BeginInvoke` 返回一个 `IAsyncResult`，其实质是实现 `IAsyncResult` 的 `System.Runtime.Remoting.Messaging.AsyncResult` 类。该对象相当于一个“凭证”，在调用 `EndInvoke` 时用于确认应等待返回的方法（猜测如此）。就像去银行，存钱时拿到一份存折（凭证），取款时依据存折（凭证）取款。  
`EndInvoke` 检索委托返回值，并返回标有 `ref/out` 的参数值。  

`IAsyncResult` 接口声明：
```c#
public interface IAsyncResult  
{  
  object AsyncState{get;}  
  WaitHandle AsyncWaitHandle{get;}  
  bool CompletedSynchronously{get;}  
  bool IsCompleted{get;}  
}  
```

### 等待调用结束的三种方法
1. 使用EndInvoke主动等待异步调用结束。这是最简单的一种方法，适用于非用户界面程序及一些IO操作，因为在调用EndInvoke之后当前线程被阻塞，除了等待什么都不能做。  
1. 使用WaitHandle等待异步调用结束。IAsyncResult中有WaitHandle成员，获取用于等待异步操作完成的WaitHandle，即调用结束信号。使用WaitHandle.WaitOne()可以阻塞当前线程至异步调用完成。这样做的好处是：在调用WaitOne之后、EndInvoke之前，可以执行其他处理。  
1. 主动轮询。使用IAsyncResult中有IsCompleted成员检索当前异步调用情况。该方法适用于用户界面程序，想象可在一个循环内做到既等待委托完成，又可以更新用户界面。  
1. 使用回调，在异步调用结束时执行一个操作。前面的BeginInvoke方法签名的最后两个参数用于回调。需要用到AsyncCallback委托：   **`public delegate void AsyncCallback(IAsyncResult asyncResult);`**  
回调方法在系统线程池中执行。BeginInvoke的最后一个参数（object asyncState）可以传递包含回调方法将要使用的信息的对象。在回调方法中调用EndInvoke可以通过取得System.Runtime.Remoting.Messaging.AsyncResult.AsyncDelegate实现。  

**个人认为方法1、2相差不算太大。**
