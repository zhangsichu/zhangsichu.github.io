---
title: Asp.Net 应用小结
date: 2006-08-30 10:18:06 + 0080
category: [Web开发]
tags: [Web, Software Development]
---

### VS2005调试JavaScript脚本  
1. IE - Tools - Options - Advanced 清除两个选项：
    1. `Disable Script Debugging (Internet Explorer)`
    1. `Disable Script Debugging (Other) `

1. VS2005 IDE - F5 to run the ASP.NET program.或者用IE浏览个画面，然后用 Ctrl+Alt+P Attach IE这个Process.  
1. VS2005 IDE - Ctrl-Alt-N to show the the Script Explorer 得到Render后的Html Source.  
1. IE - View - Script Debugger - Open  
1. IE - View - Script Debugger - Break at Next Statement 此后，操作Web Page，有脚本执行时，VS2005 IDE中就会显示脚本，可以单步执行、查看变量值等。  

### 停止页面缓存  
在一个可输入数据的Aspx Page中，用户输入新的数据内容并提交，并跳转到新的Page，之后，如果在URL栏输入刚才那个输入画面的URL，可能发现数据内容还是原先输入修改之前的旧数据。为防止这一点，可以使用如下代码避免IE缓存：
```c#
protected override void OnInit(EventArgs e)  
{  
    Response.CacheControl = "no-cache"; 
    base.OnInit(e); 
}  
```
### ViewState存放不可序列化对象   
`ViewState` 中只能保存可以序列化的实例，可是 `ADO.NET` 的 `DataRow` 不能序列化，但是有时又需要放在 `ViewState` 中。  
有一个变通方法：  
1. 存：将`DataRow` 实例的 `ItemArray` 属性放进 `ViewState` 
取：先用`DataTable.NewRow` 得到一个新的`DataRow` 实例，再设置其`ItemArray` 属性值为`Session` 或者`ViewState` 中的变量内容，即可"还原"出那个`DataRow`。  
存： 
```c#
this.ViewState.Add(viewStateKeyNameUser,JobWebContext.User.User.ItemArray);
```
取：
```c#
USERRow user = (USERRow)(new USERDataTable()).NewRow(); 
user.ItemArray = (object[])this.ViewState[viewStateKeyNameUser];
```

1. 写一个包装器存`DataTable.DataTable`可以被序列化。将`DataRow`放入`DataTable`。存`DataTable`到`ViewState`。  
存：`this.ViewState.Add(viewStateKeyNameUser,uer.Table); //uer 是一个USERRow`  
取：`((USERDataTable)this.ViewState[viewStateKeyNameUser]).Rows[0];`  

### Useful Tips 
1. Input html control close/open `style=”ime-mode:active”`.  
2. Control the text box paste `onbeforepaste="" paste =""`. 

