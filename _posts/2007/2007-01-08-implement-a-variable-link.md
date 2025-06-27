---
title: 实现一个多变的Link的全过程
date: 2007-01-08 12:17:32 + 0080
category: [Web开发]
tags: [Web, Database, Design]
---

在一个页面中有一个 **Link** 需要有不同表现形式和处理方式，这给 Web 开发带来一些不好解决的问题。在上一个JobXxx项目中就有一个类似的需求，在这里小结写出来。  

### 描述问题
要求从一个数据表中读取一组数据然后绘制一个表格，表格中的一个特定列根据取得的数据不同而不同。取得的数据表有多个列，其中的 `Column4`，是`Int`型可能取值有`0 1 2 3` 。根据这个列内容的不同，需要显示的结果也不同。当值为0时，显示一行不可以点击的普通文字如: 已经处理完成。当为1时显示一个调用Javascript 的 Link 如：你没有权限。点击后弹出一个设定的 `ModuleDialog`，要用户输入信息，这个 `ModuleDialog` 关闭后可能引发 `Postback`，也可能不引发 `PostBack`。当值为2时显示一个 `PostBack` 的 `Link` 如：删除，需要执行类似删除本行的操作。当值为3时显示两个 `Postback` 的 `Link` 如修改 和提交，修改操作，需要UI上弹出一个ModuleDialog显示修改对话框，并修改数据表中本行的一个列中的值，表明本行在修改状态。提交操作，执行类似修改本表和其他表相关信息的操作。如下图：  

**真实的数据内容**

![真实的数据内容](/assets/attachments/2007/01/08_121730_07ycdata.jpg)  

**实际要显示的样子**

![实际要显示的样子](/assets/attachments/2007/01/08_121724_3zr6display.jpg)  

### 分析问题
根据问题的描述，需要实现4种不同行为的Link：
1. 简单文字，不响应用户的点击。
2. Javascript Link调用本地 Javascript 弹出权限内容的 `ModuleDialog`。
3. `PostBack` 的 Lin k并需要带回两个参数 
    1. 用户的操作类型，确定是删除还是提交。
    2. 当前行的ID，确定用户操作的数据内容。
4. Ajax+Javascript Link 用 Javascript 调用本地 Javascript 弹出数据修改的 `ModuleDialog`，让用户修改相关数据，Ajax Send 回来修改本行的状态为正在修改。 

问题 1 只需要Render一行静态文字，问题 2 和 4 都是 Render 固定的 Javascript。这里最难实现的可能就是问 3 动态 Render 出不同的 `PostBack` Link，并且 `PostBack` 时要带回两个参数的问题。需要带回两个参数，就需要两个 `HiddenField`，在 `PostBack` 之前先调用 Javascript 填写两个参数，然后 `PostBack`。

### 求解问题  

#### 第一回尝试 `DataView`  
看到这个问题描述，我第一个想到的是使用 `DataView` 控件来做，因为需要实现的大部分内容和数据绑定有关。可以利用DataView的数据绑定来实现。托一个DataView上来就开始了Coding。当数据绑定完成，数据基本上显示出来了。开始写动态RenderLink部分的代码时我发现无从下手了，找不到一个合适的机会去修改DataView数据绑定后的数据内容。挂上DataView的RowCreated事件和RowDataBound事件虽然都可以拿到 `e.Row.DataItem` 当前行的所有信息，但数据内容都是Readonly的。因为已经DataBinding了，所以Readonly不能改了。看来只有在DataBinding之前下手，在数据绑定前先修改数据源然后再绑定。在取得数据后，再遍历修改一次数据修改成想要显示的内容。可是Column4的数据类型是Int的不能修改为一串Javascript或html。只好先把数据表中除Column4的其它的内容Copy到一个新的DataTable然后重填Column4的列类型和数据。然后数据绑定。这里把Html和Javascript当成数据写入Column4，对页面的HtmlDecode有一定影响，不过可以解决。但是从头到尾看这个方法都是很别扭。

这个方法的好处：利用了DataView的DataBinding，可以直接用DataView的`AutoGenerateEditColumn` `PageSize` 等属性，实现Row的强大功能。 

这个方法的坏处：这是个比较别扭的做法。首先，重新Copy并修改DataTable是一个非常低效的做法。当大数据时可能会出现超时的问题。可以把这种重新填数据的工作放在DA层直接写在SQL中可能会提高效率，不过这种做法，严重违反了分层的原则，把UI控制和业务逻辑直接写入了DA层。其次，Javascript Html要写入到行的内容中。非常不易维护。（本文事例代码中`BuildTestData.BuildData()`方法模拟BR层向UI层提供数据的方法。）

#### 第二回尝试 `DataList`  
由于 DataView 不能在 DataBinding 后修改数据内容，打算用 DataList 试试看看是否有办法解决问题。拖上一个DataList，并为这个 DataList 设计一个 ItemTemplate，配置一下 DataBinding 的 DataSource，这个DataList 基本上就可以工作了，DataList 显示了所有的数据信息和刚才的 DataView的显示结果差不多。修改`Column4` 的显示方法，自己动态Render可以实现了需要的显示结果。

```
<asp:DataList ID="DataList1" runat="server" CellPadding="4" DataSourceID="ObjectDataSource1" ForeColor="#333333" BorderColor="PaleVioletRed" BorderWidth="1px">
    <FooterStyle BackColor="#1C5E55" Font-Bold="True" ForeColor="White" />  
    <SelectedItemStyle BackColor="#C5BBAF" Font-Bold="True" ForeColor="#333333" />  
    <AlternatingItemStyle BackColor="White" />  
    <ItemStyle BackColor="#E3EAEB" />  
    <HeaderStyle BackColor="#1C5E55" Font-Bold="True" ForeColor="White" />  
    <ItemTemplate>  
    <table>  
        <tr>  
            <td width="150px">  
                <%# DataBinder.Eval(Container.DataItem, "Column0")%>  
            </td>  
            <td width="150px">  
                <%# DataBinder.Eval(Container.DataItem, "Column1")%>  
            </td>  
            <td width="150px">  
                <%# DataBinder.Eval(Container.DataItem, "Column2")%>  
            </td>  
            <td width="150px">  
                <%# DataBinder.Eval(Container.DataItem, "Column3") %>  
            </td>  
            <td width="100px">  
                <%# DrawFourRow(Container.DataItem)%>  
            </td>  
            <td width="150px">  
                <%# DataBinder.Eval(Container.DataItem, "Column5")%>  
            </td>  
        </tr>  
    </table>  
    </ItemTemplate>  
</asp:DataList>
```

是这个 `DrawFourRow` 给出了一个重新定义Render的口子。`DrawFour`
```c#
protected string DrawFourRow(object dataItem)  
{  
    DataRowView row = dataItem as DataRowView; 
    if (null == row)  
    {  
        return string.Empty;  
    }

    int? i = row[4] as int?; 
    if(!i.HasValue)  
    {  
        return string.Empty;  
    }

    switch (i.Value)  
    {  
        case 0:  
            return "已经处理完成";  
        
        case 1:  
            return "<a href=\"#\" onclick=\"" + string.Format(JavascriptNoAuthorizationFunction,row[0].ToString()) + JavascriptReturnFalse + "\">你没有权限</a>"; 
        
        case 2:  
            return "<a href=\"#\" onclick=\"" + string.Format(JavascriptAssignParameterFunction, ViewDeleteLinkMark, row[0].ToString()) + JavascriptSubmitFunction + "\">删除</a>"; 
        
        case 3:  
            return "<a href=\"#\" onclick=\"" + string.Format(JavascriptModifyFunction, row[0].ToString()) + JavascriptReturnFalse + "\">修改</a> <a href=\"#\" onclick=\"" + string.Format(JavascriptAssignParameterFunction, ViewApplyLinkMark, row[0].ToString()) + JavascriptSubmitFunction + "\">提交</a>"; 
        
        default:  
            return string.Empty;  
    }  
}
```

为了配合 `DrawFour` 需要一些Javascript, 和两个 `HiddenFiled` 来记录操作类型和当前行信息。（详细内容在事例代码中）  
这个方法的好处：从性能上比用DataView要好得多，一次Render解决问题。给自己定义Render留出了很大的空间。  
这个方法的坏处：需要为每一个可以 PostBack 的行为，在PostBack之前调用 Javascript 设置一个与自己操作类型独一无二的 `ProcessType`，以保证PostBack后可以找到指定的处理方法。所以当界面上可以PostBack的控件多起来的时候，这不是一个好做法。同时需要在客户端写一个Javascript PostBack的方法，调用`Forms[0].submit();`这种做法有点野蛮，不够美观。

#### 第三回尝试 `IPostBackEventHandler`   
去掉那两个 `HiddenField`， 在当前的Page会提供 `this.Page.ClientScript.GetPostBackClientHyperlink ` 这样一个方法，

```c#
ClientScriptManager.GetPostBackClientHyperlink (Control, String) 
ClientScriptManager.GetPostBackClientHyperlink (Control, String, Boolean)   
```
`GetPostBackClientHyperlink` 会产生 `javascript:__doPostBack(para1,para2)` 这样一个客户端的 Javascript 来 `PostBack`，当客户端没有 `PostBack` 对应的 `__doPostBack` 方法时会添加一个客户端 `PostBack` 的 Javascript 方法。  
```js
var theForm = document.forms[form1];  
if (!theForm) {  
    theForm = document.form1;  
}  
function __doPostBack(eventTarget, eventArgument) {  
    if (!theForm.onsubmit || (theForm.onsubmit() != false)) {  
        theForm.__EVENTTARGET.value = eventTarget;  
        theForm.__EVENTARGUMENT.value = eventArgument;  
        theForm.submit();  
    }  
}  
```

观察这个方法，发现服务器端会通过 `__EVENTTARGET` 和 `__EVENTARGUMENT` 这两个 `Asp.Net` 引擎自己的 `HiddenField` `来传递PostBack` 的参数， `__EVENTTARGET` 来确定 Raise 的 Event 和回调的方法，`__EVENTARGUMENT`来确定 argument。是否可以利用这两个东东来代替原来自己的添加的 `HiddenField` 并完成任务。  

经过测试和查看MSDN发现，`GetPostBackClientHyperlink` 送入的两个参数一个是 `Control`，一个是 `String` 参数。被R ender 成客户端的 Javascript 后， `__doPostBack` 的前一个参数是 `Control` 的 `ClientID`，后一个是自己送的 `String` 参数。经过几次尝试用一个LinkButton，并重写 `Page的RaisePostBackEvent` 方法实现了去掉那两个 `HiddenField` 的想法。  

1. 先加一个可以触发 `PostBack` 的Asp Server端的 Control，设置这个Control的 `Visible` 为 `False`，这个Control没有真正的界面用处，只是告诉 Asp 引擎有一个 `PostBack` 的 Control: `<asp:LinkButton ID="helpButton" runat="server" Visible="false" OnClick="helpButton_Click">LinkButton</asp:LinkButton>`

2. 在要`Post的Link`处调用G`etPostBackClientHyperlink`方法写入调用 Postback要Render的客户端代码。 
```c#
HyperLink link = container.FindControl("hlnkFourColumn") as HyperLink;
if (link != null) {  
 link.Text = "删除";  
 link.NavigateUrl = this.Page.ClientScript.GetPostBackClientHyperlink(helpButton, ViewDeleteLinkMark + ParameterSeparator + row[0].ToString());
 link.Visible = true;
} //第二个参数写想要传回来的参数。  
```

3. Override Page的 `RaisePostBackEvent` 方法。

```c#
base.RaisePostBackEvent(sourceControl, eventArgument);  

//Now the eventArgument will be the director.  
WebControl control = sourceControl as WebControl;  

if (control != null && control == this.helpButton)  
{  
    if (!string.IsNullOrEmpty(eventArgument))  
    {  
        string[] para = eventArgument.Split(new string[] { ParameterSeparator }, StringSplitOptions.RemoveEmptyEntries);  
        if (para[0] == ViewDeleteLinkMark)  
        {  
            ViewDelete_Click(para[1]);  
        }  
        if (para[0] == ViewApplyLinkMark)  
        {  
            ViewApply_Click(para[1]);  
        }  
    }  
}
```
拆解参数，指定调用方法。  

**这个方法的好处：**去掉了自己添加的 `HiddenField`，不用维护 `HiddenField`，也不用担心界面上有再多的PostBack控件。    
**这个方法的坏处：**需要添加一个占位子的不显示的可以PostBack的Server端控件。

#### 第四回尝试 Page+IPostBackEventHandler
去掉那个占位子的Server端控件，用HttpLook观察上一种方法的Request的内容，在名值串中`__EVENTTARGET`，`__EVENTARGUMENT`中都有值，所以可以直接在`PageLoad` 中使用 `this.Request["__EVENTTARGET"]`，拿到值。所以想到了让page直接来当这个占位子的Server端Control，所以代码变为了 `link.NavigateUrl = this.Page.ClientScript.GetPostBackClientHyperlink(this, ViewDeleteLinkMark + ParameterSeparator + row[0].ToString());` 同时Page 继承 `IPostBackEventHandler` 这个接口，实现 `public void RaisePostBackEvent(string eventArgument)` 方法。

```c#  
public void RaisePostBackEvent(string eventArgument)  
{  
    if (!string.IsNullOrEmpty(eventArgument))  
    {  
        string[] para = eventArgument.Split(new string[] { ParameterSeparator }, StringSplitOptions.RemoveEmptyEntries);  
        if (para[0] == ViewDeleteLinkMark)  
        {  
            ViewDelete_Click(para[1]);  
        }  
        if (para[0] == ViewApplyLinkMark)  
        {  
            ViewApply_Click(para[1]);  
        }  
    }  
}  
//最终实现要求。通过上面的一次次变化，可以抽出一个种Link可以带回一个参数并且不用HiddenField:  
public delegate void BackLinkWithParameterEventHandler(object sender, BackLinkWithParameterEventArgs e);  
public class BackLinkWithParameterEventArgs : EventArgs  
{  
    public string PostBackParameter;  
    public BackLinkWithParameterEventArgs(string eventArgument)  
    {  
        this.PostBackParameter = eventArgument;  
    }  
}  

/// <summary>  
/// Summary description for T5BackLinkWithParameter  
/// </summary>  
public class T5BackLinkWithParameter : HtmlAnchor  
{  
    public bool IsNeedPostBack;  
    public event BackLinkWithParameterEventHandler ClickPostBack;  
    public string PostBackParameter;  

    public T5BackLinkWithParameter()  
    {  
    }  

    protected override void RenderAttributes(HtmlTextWriter writer)  
    {  
        if (IsNeedPostBack)  
        {  
            this.HRef = this.Page.ClientScript.GetPostBackClientHyperlink(this, this.PostBackParameter);  
        }  
        base.RenderAttributes(writer);  
    }  

    protected override void RaisePostBackEvent(string eventArgument)  
    {  
        base.RaisePostBackEvent(eventArgument);  
        this.OnClickPostBack(eventArgument);  
    }  

    private void OnClickPostBack(string eventArgument)  
    {  
        if (this.ClickPostBack != null)  
            ClickPostBack(this, new BackLinkWithParameterEventArgs(eventArgument));  
    }  
} 

//使用这个Control的代码：  
protected void Page_Load(object sender, EventArgs e)  
{  
    T5BackLinkWithParameter link = new T5BackLinkWithParameter();  
    link.IsNeedPostBack = true;  
    link.PostBackParameter = "Test";  
    link.ClickPostBack += new BackLinkWithParameterEventHandler(link_ClickPostBack);  
    link.InnerText = "Test";  
    this.pHolder.Controls.Add(link);  
}  

void link_ClickPostBack(object sender, BackLinkWithParameterEventArgs e)  
{  
    this.Title = e.PostBackParameter;  
}  
```

详细内容在示例代码中
[源程序](/assets/attachments/2007/01/08_131844_jg9mLinkProblem.rar) 

