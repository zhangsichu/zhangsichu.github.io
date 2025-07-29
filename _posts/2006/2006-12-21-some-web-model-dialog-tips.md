---
title: Some Web Model Dialog Tips
date: 2006-12-21 13:56:00 + 0080
category: [Web开发]
tags: [Web, Design]
---

Some Web Model Dialog Tips 原始信息来在公司的 Community Server，经过自己补充和整理。  

用 Javascript 打开一个 modalDialog 时，IE常常会缓存这个 Page。同时用`XMLHttpRequest` 的`Send`进行请求的时候，IE也会缓存这个 Page。如何解决?  
(1) 在要打开或要请求的Url后面多加一个随机参数，来避免页面被缓存,随便加一个什么都行,只要每次都不一样。  
```js
var url = Page.aspx?Id=0&temp= + Math.random(); 
window.showModalDialog(url, , status:no; help:no;);
```

(2) 在该 Asp.net 页面的 `Page_Load` 方法里设定不缓存。  
```c#
protected void Page_Load(object sender, EventArgs e) { 
    Response.Expires = 0; 
    Response.Cache.SetNoStore(); 
    Response.AppendHeader("Pragma", "no-cache"); 
}
// 或者   
protected void Page_Load(object sender, EventArgs e) { 
    this.Response.CacheControl = "no-cache";  
}  
```

如果这个 modalDialog 页面上有 `form.submit()`，用 Asp.Net 开发时这个 submit 会在客户端打开一个新的IE，而不是在那个modalDialog上更新，这时候该怎么办?  
(1) 需要给打开的那个modalDialog的父页面的Html的Head部分添加 `<base target=_self></base>` 这样一段话。  

(2) 先实现一个模态对话框页面文件 Frame.aspx, 在其中写上  
```html
<body>  
    <iframe width=600 height=400 name=aa frameborder=0 src="Task.aspx"></iframe>  
</body>
```

然后 实现Task.aspx页面文件，这个是真正提供用户内容输入和提交的页面。套的这个 iframe 帮忙做到了。 

