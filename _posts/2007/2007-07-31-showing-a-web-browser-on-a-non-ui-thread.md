---
title: 在非UI线程上Show一个含有WebBrowser的Form出现的问题
date: 2007-07-31 16:20:46 + 0080
category: [.Net/Java]
tags: [C#, Web, Multithreading]
---

### 问题描述  

客户端的 Windows 程序使用 `WebMethod` 从服务器上取得一个系统信息列表。信息列表中有多条 Message。当系统消息的时间合要求，使用一个自定义的 `MessageForm` Show出这个系统 `Message。MessageForm` 是一个含有 `WebBrowser` 的 `WinForm`， Show `MessageForm` 的调用在一个 `Timer` `中被执行。当调用ShowMessage` 的操作时会出现下面的错误。    
![Error](/assets/attachments/2007/07/31_161910_b91euiprocesspb1.gif)  

**出错的代码：**  
```c#
private void btnTestS_Click(object sender, EventArgs e)  
{  
    DataRow row = (new DataTable()).NewRow();  
    System.Threading.Timer timer = new System.Threading.Timer(
        new System.Threading.TimerCallback(ShowMessageFormS),  
        row,  
        0, 
        30000);  
}  
private void ShowMessageFormS(object status)  
{  
    (new MessageForm()).Show();  
}
```

在`new MessageForm`时，MessageForm调用自己的`InitializeComponent()`方法时出错。如果把MessageForm上的 `WebBrowser` 控件删除掉，程序可以正常 Show 出 Form，不出错。  

### 问题调查  
从程序的错误信息看出，可能是`ActiveX`的套间问题。`ActiveX` 的 `WebBrowser` 要求当前 `Thread` 是一个`single-thread apartment`。`WebBrowser Com `组件要求当前线程是一个单套间的，而S`ystem.Threading.Timer` 起来的线程是一个 `MTAThread` 多套间的。产生了问题。  

### 修改方案 
#### 方案一 使用新线程启动`MessageForm`并设置这个线程的`ApartmentState`为`STA`

```c#  
private void btnTestT_Click(object sender, EventArgs e)  
{  
    DataRow row = (new DataTable()).NewRow();  
    System.Threading.Timer timer = new System.Threading.Timer(  
        new System.Threading.TimerCallback(ShowMessageFormT),  
        row,  
        0,  
        300000);  
}  

private void ShowMessageFormT(object status)  
{  
    System.Threading.Thread thread = new System.Threading.Thread(new System.Threading.ParameterizedThreadStart(ShowMessage));  
    
    thread.SetApartmentState(System.Threading.ApartmentState.STA);
    thread.Start(status);  
}  

private void ShowMessage(object status)  
{  
    System.Windows.Forms.Application.Run(new MessageForm());  
    (new MessageForm()).ShowDialog();  
}  
```  

#### 方案二 用主UI线程调度并 `Show MessageForm`
```c#
private void btnTestG_Click(object sender, EventArgs e)  
{  
    DataRow row = (new DataTable()).NewRow();  
    System.Threading.Timer timer = new System.Threading.Timer(  
        new System.Threading.TimerCallback(ShowMessageFormG),  
        row,  
        0,  
        300000);  
}  

private delegate void ShowMessageHandler(DataRow row);  
private void ShowMessageFormG(object status)  
{  
    if (System.Windows.Forms.Application.OpenForms[0].InvokeRequired)  
    {  
        System.Windows.Forms.Application.OpenForms[0].Invoke(new ShowMessageHandler(ShowMessageFormG), new object[] { status });
        return;  
    }  
    
    ShowMessage(status);  
}  
private void ShowMessage(object status)  
{  
    (new MessageForm()).ShowDialog();  
}  
```

示例中的 `DataRow row = (new DataTable()).NewRow();` 没有实际意义，在实际代码中 `ShowMessage` 需要一个 `DataRow` 来绘制消息。示例代码中的 `DataRow` 只是为了模拟实际的环境，没有实际意义。  

[**源代码**](/assets/attachments/2007/07/31_162029_52t8UIProcessTest.rar)

