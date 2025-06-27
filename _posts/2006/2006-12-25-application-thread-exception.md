---
title: 好用的 ThreadException
date: 2006-12-25 16:56:53 + 0080
category: [.Net/Java]
tags: [C#, Software Development]
---

好用的 `Application.ThreadException`，在编写Windows程序中，在VS2005下都会用下面的代码来启动主 `Form`
```c#  
[STAThread]  
static void Main()  
{  
    Application.EnableVisualStyles();  
    Application.SetCompatibleTextRenderingDefault(false);  
    Application.Run(new MainForm());  
}
```
这段代码一般由IDE自动生成。`Application.Run` 启动一个线程，这里把一个 `MainForm` 放在这个线程中，并把这个线程放入Application Main这个进程中，并完成消息循环。 如何当这个线程出 `Exception` 时，Handle 上这个线程中的 `Exception`，用 `Application.ThreadException +=`自己的处理方法。  

这个方法十分简单的为客户代码提供了一个处理 MainForm线程中所有Exception的接口。用十分方便的手段 Handle 了 Application 中的 `ThreadException`。 



