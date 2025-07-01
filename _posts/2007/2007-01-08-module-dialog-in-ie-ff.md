---
title: Module Dialog In IE & FF
date: 2007-01-08 13:55:36 + 0080
category: [Web开发]
tags: [Web, Design]
---

本文原始内容来自公司的 Community Server 经过自己修改和编辑。  
本文实现了一个在IE和FF下都可以正常使用的ModuleDialog。  
主要使用`window.open`方法打开`Dialog`。  
使用 `window.onclick=function (){DialogWin.focus()};` 和 `event.cancelBubble = true;` 保证弹出窗口的Module样式。

**详细内容**
- ParentWindow

```js  
function OpenDialog() {  
    if(window.document.all)//IE  
    {  
        //参数  
        var strPara = "dialogHeight:200px;dialogWidth:300px;help:off;resizable:off;scroll:no;status:off"; 
        
        //传入的值  
        var strPassIn=window.document.getElementById("txtReturn").value; 
        
        //打开模态对话框  
        var strReturn=window.showModalDialog("ChildOpenWindow.htm",strPassIn,strPara); 
        
        //处理返回值  
        if(typeof(strReturn) != undefined)   
        {  
            window.document.getElementById("txtReturn").value=strReturn; 
        }  
    }  
    else//FireFox  
    {  
        //参数  
        var strPara = "dialogHeight:200px;dialogWidth:300px;help:off;resizable:off;scroll:no;status:off;modal=yes;dialog=yes"; 
        var strPassIn=window.document.getElementById("txtReturn").value; 

        //注册事件  
        window.myAction=this; 

        //打开窗口  
        var DialogWin = window.open("ChildOpenWindow.htm","myOpen",strPara,true); 

        //传入参数  
        window.myArguments=strPassIn; 

        this.returnAction=function(strResult) { 
            //处理返回结果  
            if(typeof(strResult) != undefined)  
            {  
                window.document.getElementById("txtReturn").value=strResult; 
            }  
         }  

        //处理打开窗口最上显示（不完美）  
        window.onclick=function (){DialogWin.focus()}; 
        event.cancelBubble = true;  
    }  
}  
```

- ChildWindow   

```js  
function window_onload() {  
    if(window.document.all)//IE  
    {  
        //对于IE直接读数据  
        var txtInput=window.document.getElementById("txtInput"); 
        txtInput.value=window.dialogArguments; 
    }  
    else//FireFox  
    {  
        //获取参数  
        window.dialogArguments=window.opener.myArguments; 
        var txtInput=window.document.getElementById("txtInput"); 
        txtInput.value=window.dialogArguments; 
    }  
}  

function OnOKClick() {  
    //对于IE或者FireFox都需要设置returnValue进行返回值设定  
    var inputStr=window.document.getElementById("txtInput").value; 
    returnValue=inputStr; 
    window.close(); 
}  

function window_onunload() { 
    //对于Firefox需要进行返回值的额外逻辑处理  
    if(!window.document.all)//FireFox  
    {  
        window.opener.myAction.returnAction(window.returnValue)  
    }  
}
```

- 注册 onload 
`<body language="javascript" onload="return window_onload()" onunload="return window_onunload()">`

