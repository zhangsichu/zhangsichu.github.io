---
title: 如何区分PostBack是F5刷新还是FormSubmit
date: 2006-10-18 18:31:20 + 0080
category: [Web开发]
tags: [C#, Software Development, Web]
---

在一个页面上有很多 `Button` 或者可以提交的 `Html Dom` 对象，如何区分服务器端收到的 `PostBack` 是用户点击的 `FromSubmit` 还是 **F5** 页面刷新。在 http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dnvs05/html/BedrockASPNET.asp 这篇文章的 `Trap the Browser Refresh` 部分讲述了一个办法，用 `Page.RegisterHiddenField` 注册一个 `HiddenField` 和 `Session` 中的`Ticket` 比较，确定是否是 `Refresh` 的办法。这个办法用到了 `IHttpModule` `HttpContext`,在 `IHttpModule.Init(HttpApplication context)` 时把是否是 `Refresh` 的属性放在 `HttpContext` 中，供整个`Page` 的生命周期 **(LifeCycle)** 使用。和这个方法的想法，差不多，下面是一个比较简便的实现方法。  

用 `Session` 和 `ViewState` 的特定 Key 比较检查是否是刷新。每次 `OnPreRender` 后再次重新发号。  

```c#
public partial class F5 : System.Web.UI.Page  
{  
    private static string MaskKey = "____MASKKEY"; //注册全局的MaskKey 
    protected void Page_Load(object sender, EventArgs e)  
    {  
        ShowStatus();//打印状态 
    }  
    private void InitialMask()  
    {  
        this.Session[MaskKey] = this.ViewState[MaskKey] = Guid.NewGuid().ToString();//重新发号 给Session 和 ViewState 新的Guid Session在服务器端标志 ViewState放在客户端标志 
    }  
    protected override void OnPreRender(EventArgs e)  
    {  
        base.OnPreRender(e); 
        InitialMask();//发号 
    }  
    public bool IsRefresh  
    {  
        get  
        {  
            if (this.Session[MaskKey] == null || this.ViewState[MaskKey] == null) return false;  
            return !this.Session[MaskKey].ToString().Equals(this.ViewState[MaskKey].ToString());//检查Key是否相同  
        }  
    }  
    protected void btnTest_Click(object sender, EventArgs e)  
    {  
        this.lblGuid.Text = this.Session[MaskKey].ToString() + " " + this.ViewState[MaskKey].ToString();//打印Key 
    }  
    private void ShowStatus()  
    {  
        if (this.IsRefresh)  
        {  
            this.lblShow.Text = "F5 Refresh"; 
        }
        else  
        {  
            this.lblShow.Text = "Html Dom submit"; 
        }
    }
}
```

IE 的 F5 Refresh 提交的是IE中最后一次对服务器的请求，也就是上的`ViewState`中的东西，由于没有使用`Html Dom`来提交，没有提交这次新发的`ViewState Key`。这样`Session`中的`Key`和`ViewState`中的`Key` (上次的`ViewState`)不相同，则认为是 F5 刷新。如果是相同的则说明用了最后`Render`的 `Session Key`和`ViewState Key`所以被认为是`Html Dom`的`FormSubmit`。 如下图：  

![Flow Chart](/assets/attachments/2006/10/18_183101_a8zdF5Problem.gif)
