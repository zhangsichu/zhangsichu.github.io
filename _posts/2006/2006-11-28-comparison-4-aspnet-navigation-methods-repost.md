---
title: ASP.NET四种页面导航方式之比较与选择[转载]
date: 2006-11-28 10:00:42 + 0080
category: [Web开发]
tags: [Web, C#, Design, Performance, 转载]
---

本文转载自公司的 Community Server

今天有人问了一下 Redirect 和 Transfer 的区别，想了半天没想起来，Google 到这个文章，讲的挺细致，关心的人可以了解一下。  

ASP.NET四种页面导航方式之比较与选择  

### 1 超级链接  
从一个表单进入另一个表单最简单的方式是使用HTML超级链接控件。在Web表单中，使用超级链接的HTML代码类如：  

`<a href="WebForm2.aspx">进入表单2</a>` 

当用户点击该超级链接，`WebForm2.aspx` 执行并将结果发送到浏览器。超级链接导航方式几乎可用于任何地方，包括HTML页面和普通的ASP页面。ASP.NET 还提供了另一种可替换使用的方法，即 HyperLink 服务器控件：  

```html
<form id="Form1" method="post" runat="server">  
    <asp:HyperLink id="HyperLink1" runat="server" NavigateUrl="WebForm2.aspx">进入表单2</asp:HyperLink>  
</form>  
```

上述HTML代码的运行结果和第一个例子相同，因为 ASP.NET 把 HyperLink Web服务器控件视为一个HTML超级链接控件。但两者有一点重要的区别，HyperLink Web服务器控件可以在服务器端编程。具体地说，可以在程序代码中改变它的 NavigateUrl 属性，从而允许构造出具体目标可根据应用的当前状态动态变化的超级链接，例如：  

```vb
Private Sub Button1_Click( _  
ByVal sender As System.Object, _  
ByVal e As System.EventArgs) _  
    Handles Button1.Click  
    HyperLink1.NavigateUrl = "WebForm3.aspx"  
End Sub  
```
这段代码执行后，如果用户点击链接，他看到的将是 `WebForm3.aspx`，而不是 `WebForm2.aspx`。  

### 2 用程序控制重定向
虽然超级链接能够从一个页面导航到另一个页面，但这种导航方式是完全由用户控制的。有些时候，我们可能要用代码来控制整个导航过程，包括何时转到另一个页面。在这些场合，ASP.NET 有三种不同的方式可以达到相似的目的：调用 Response 对象的 Redirect 方法，调用 Server 对象的 Transfer 或 Execute 方法。这三种导航方式的行为基本相似，但也有区别。  

#### 2.1 Response.Redirect
Response.Redirect 方法导致浏览器链接到一个指定的URL。当`Response.Redirect()`方法被调用时，它会创建一个应答，应答头中指出了状态代码 302（表示目标已经改变）以及新的目标URL。浏览器从服务器收到该应答，利用应答头中的信息发出一个对新URL 的请求。  

这就是说，使用`Response.Redirect` 方法时重定向操作发生在客户端，总共涉及到两次与服务器的通信（两个来回）：第一次是对原始页面的请求，得到一个302应答，第二次是请求302应答中声明的新页面，得到重定向之后的页面。  

#### 2.2 Server.Transfer  
`Server.Transfer` 方法把执行流程从当前的ASPX文件转到同一服务器上的另一个ASPX页面。调用 `Server.Transfer` 时，当前的ASPX页面终止执行，执行流程转入另一个ASPX页面，但新的ASPX页面仍使用前一ASPX页面创建的应答流。  

如果用`Server.Transfer` 方法实现页面之间的导航，浏览器中的URL不会改变，因为重定向完全在服务器端进行，浏览器根本不知道服务器已经执行了一次页面变换。默认情况下，`Server.Transfer` 方法不会把表单数据或查询字符串从一个页面传递到另一个页面，但只要把该方法的第二个参数设置成 `True`，就可以保留第一个页面的表单数据和查询字符串。  

同时，使用 `Server.Transfer` 时应注意一点：目标页面将使用原始页面创建的应答流，这导致 ASP.NET的机器验证检查（Machine Authentication Check，MAC）认为新页面的ViewState已被篡改。因此，如果要保留原始页面的表单数据和查询字符串集合，必须把目标页面`Page` 指令的`EnableViewStateMac` 属性设置成 `False`。  

#### 2.3 Server.Execute  
Server.Execute方法允许当前的ASPX页面执行一个同一Web服务器上的指定ASPX页面，当指定的ASPX页面执行完毕，控制流程重新返回原页面发出`Server.Execute` 调用的位置。  

这种页面导航方式类似于针对ASPX页面的一次函数调用，被调用的页面能够访问发出调用页面的表单数据和查询字符串集合，所以要把被调用页面Page指令的`EnableViewStateMac`属性设置成 `False`。  

默认情况下，被调用页面的输出追加到当前应答流。但是，`Server.Execute` 方法有一个重载的方法，允许通过一个 `TextWriter` 对象（或者它的子对象，例如`StringWriter` 对象）获取被调用页面的输出，而不是直接追加到输出流，这样，在原始页面中可以方便地调整被调用页面输出结果的位置。  

为说明其工作过程，下面我们创建一个Web表单，放入一个按钮控件`Button1` 和一个文本控件 `Literal1`，在设计界面中转入代码视图，加入一个 `System.IO` 名称空间的 `Imports` 语句，然后加入用户点击按钮时执行的代码：  

```vb
Private Sub Button1_Click( _  
ByVal sender As System.Object, _  
ByVal e As System.EventArgs) _  
    Handles Button1.Click  
    Dim sw As StringWriter = New StringWriter()  
    Server.Execute("WebForm2.aspx", sw)  
    Literal1.Text = sw.ToString()  
End Sub
```

然后为同一个Web应用创建第二个页面`WebForm2.aspx`。转入该页面的HTML视图，修改其Page指令禁止`ViewState` 检查：  

`<%@ Page Language="vb" AutoEventWireup="false" Codebehind="WebForm2.aspx.vb" Inherits="Navigate.WebForm2" EnableViewStateMac="false"%>`

再转到设计视图，为第二个页面增加一些控件。接下来，把第一个页面设置成默认页面，启动应用。点击按钮，WebForm2的控件将显示在WebForm1中放置Literal按钮的地方，如图，注意页面标题和URL仍旧显示原始页面WebForm1。  

![Demo](/assets/attachments/2006/11/28_100030_tqiwtransfer.gif)  

用`Server.Transfer`或`Server.Execute` 方法实现导航时，还要注意一点：最后得到的页面可能不是合法的HTML页面，因为最终返回给客户端的页面可能包含多个`<HTML>`和 `<BODY>` 等标记。IE浏览器看来能够容忍并正确处理这类情形，但如果用户要用到其他的浏览器，最好仔细测试一下。  

### 3 比较与选择 

既然从一个页面导航到另一个页面的办法有这么多，应该如何选择最佳的导航方式呢？下面是一些需要考虑的因素：  
1. 如果要让用户来决定何时转换页面以及转到哪一个页面，超级链接最适合。  
1. 如果要用程序来控制转换的目标，但转换的时机由用户决定，使用Web服务器的HyperLink控件，动态设置其NavigateUrl属性。  
1. 如果要把用户连接到另一台服务器上的资源，使用`Response.Redirect`。  
1. 用Response.Redirect把用户连接到非ASPX的资源，例如HTML页面。  
1. 如果要将查询字符串作为URL的一部分保留，使用`Response.Redirect`。  
1. 如果要将执行流程转入同一Web服务器的另一个ASPX页面，应当使用`Server.Transfer`而不是`Response.Redirect`，因为`Server.Transfer` 能够避免不必要的网络通信，从而获得更好的性能和浏览效果。  
1. 如果要捕获一个ASPX页面的输出结果，然后将结果插入另一个ASPX页面的特定位置，则使用`Server.Execute`。  
1. 如果要确保HTML输出合法，请使用`Response.Redirect`，不要使用`Server.Transfer或Server.Execute` 方法。  
