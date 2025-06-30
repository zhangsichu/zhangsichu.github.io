---
title: 使用透明叠加法美化文件上传界面
date: 2007-02-03 13:05:36 + 0080
category: [Web开发]
tags: [Design, GUI, Web]
---

使用透明叠加法的方法实现没有使用Iframe的操作。把文件域放在点击的span上，并让它透明。这样用户看到的是自定义span点击区域，看不到文件浏览的区域。点击的依然是浏览按钮，没有违反任何安全机制。  
原方法借鉴位置。 https://www.script8.com/bbs/thread.asp?tid=6  
```html
<html>  
    <head>  
        <title>Test HTML</title>  
        <meta http-equiv="Content-Type" content="text/html; charset=gb2312"> 
        <style>  
        body   
        {  
            font-size:12px;  
            cursor:default;  
        }  
        .hand  
        {  
            cursor:pointer;  
            cursor:hand;  
        }  
        .btnFade  
        {  
            position:absolute;  
            padding-top:3px;  
            font-family:宋体;  
        }  
        .btnReal  
        {  
            position:absolute;  
            width:60px;  
            overflow: hidden;  
            -moz-opacity: 0.5; /* Old Mozilla Browsers */
            -webkit-opacity: 0.5; /* Old Webkit browsers (Safari, Chrome, various others) */
            -khtml-opacity: 0.5; /* Really old Safari browsers and Konqueror */
            opacity: 0.5; /* Modern browsers */
        }  
        .fileElement  
        {  
            float:left;  
            margin-right:6;  
            padding-top:3;  
            color:darkgreen;  
        }  
        </style>  
    </head>  
    <body onload="setup();"> 
    <script language="javascript" type="text/javascript">   
        //Use the reload tech could hide some control ui.  
        function setup(){ 
            $("btnReal").innerHTML = "<input onchange=\"addFile(this);\" type=\"file\" size=\"1\" class=\"hand\" hidefocus=\"true\" />"; 
        }  

        function addFile(file){ 
            //Create object append filename.  
            var fileName,fileElement;  
            fileName=file.value.replace(/\\/g,"/").replace(/(.*\/)(.*)/,"$2"); 
            file.style.display = "none"; 
            fileElement=document.createElement("nobr"); // just want to display the file. 
            fileElement.className="fileElement"; 
            fileElement.innerHTML = "□"+fileName; //Add the fileName.
            fileElement.innerHTML += "<font style=color:red;font-weight:bold; onclick=\"$(fileList).removeChild(this.parentNode);\" class=hand>"+ unescape("×")+"</font>"; //Add the delete button. 
            $("fileList").insertBefore(fileElement,$("btnFile"));
            setup();
        }

        function $(element){  
            return typeof(element)== "object" ? element : document.getElementById(element);
        }  
    </script>
    <div id="fileList">  
        <div id="btnFile" onmouseover="$(btnFade).style.textDecoration=underline;" onmouseout="$(btnFade).style.textDecoration=none;" style="color:Navy"> <!--this div just want to display a hand.-->
            <span id="btnFade" class="btnFade" style="cursor:pointer">#@#添加附件</span>
            <span id="btnReal" class="btnReal" onmouseover="this.scrollLeft=100px"></span>
        </div>  
    </div>  
    </body>  
</html>  
```
