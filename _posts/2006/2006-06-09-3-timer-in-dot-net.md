---
title: .NET 中的Timer3胞胎
date: 2006-06-09 10:57:38 + 0080
category: [.Net/Java]
tags: [C#, Multithreading, Debugging]
---

Win32 平台上有两种线程：UI线程和工作线程。UI线程大多数时间是空闲的，它实际上是一个形如：  
```c#
while(GetMessage (&msg))  
{  
    ProcessMessage (&msg);
}
```

的循环。如果这个UI线程的消息队列中有消息， UI线程就会取出这个message并处理。工作线程没有message loop，主要用来在后台处理事务。  

### System.Windows.Forms.Timer - Control
`System.Windows.Forms.Timer` Control windows timer，其历史可以追溯到vb 1.0，主要是为了方便 windows froms 程序的编写。有一个 `Interval` 属性。为使用UI线程进行事务处理的单线程环境设计，依赖于OS的 timer message，精度较差。操作可以在 UI 线程中进行，也可以在别的线程中进行。  

### System.Timers.Timer - Component
`System.Timers.Timer` component 有一个 `Interval` 属性。针对server的多线程环境进行了了优化，采用了和 `System.Windows.Forms.Timer` 不同的架构。值得注意的是 `System.Timers.Timer` 的`SynchronizingObject` 属性。如果这个属性为 `null`，处理 Elapsed event 由线程池中的线程触发，即 Elapsed event 的处理函数将运行在系统线程池的线程中，如果`SynchronizingObject` 属性被设置为一个Windows Forms component，那么 Elapsed event 的处理函数将运行在生成 component 的那个线程中,通常情况下,这个线程就是UI线程。 如果处理Elapsed event的方法的执行时间大于`Interval` 属性的值，又会有一个线程池中的线程激发Elapsed event，Elapsed event的处理函数将会被重入。
注意：由于Elapsed event由线程池中的线程出发，存在着这样的可能：event 的处理函数正在执行，而另一个线程池中的线程调用的 `Timer.Stop()`,这将导致在 `Timer.Stop()` 调用后Elapsed event仍可被触发。使用`Interlocked.CompareExchange()` 可以避免这种情况。  

### System.Threading.Timer - Class
`System.Threading.Timer` class 在代码中使用,不依赖于OS的Timer使用 TimerCallback delegate 来指定需要执行的函数,这个函数将执行在线程池的线程中,而不是生成 `System.Threading.Timer` 的线程中。在timer生成后，可以使用`System.Threading.Timer.Change()` 来重新定义Timer的等待时间和执行间隔时间。  
注意：如果使用了`System.Threading.Timer`，就要保持对Timer的引用，否则：Timer将会被GC回收，使用`Timer.Dispose()`可以释放Timer所占用的资源。由于callback函数由线程池中的线程执行,如果timer的interval值小于callback函数的执行时间，callback函数会被多个线程执行。如果线程池中的线程被用光，Callback函数会排队等待，不能如期执行。  


`ThreadPool` 线程池中的线程为后台线程,其IsBackgroud为true, 当application的所有前台线程执行完毕后,就算是线程池中的线程仍在执行，application也会结束。  

