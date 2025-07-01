---
title: Javascript中的错误处理
date: 2007-07-16 21:06:15 + 0080
category: [Web开发]
tags: [Web, Debugging]
---

### Javascript中的错误处理有两种方法

#### 使用 `window.onerror` 指定错误处理函数  
当有错误的时候，`onerror` 会被 callback。 当某个JavaScript block中有多个script错误时，第一个错误触发后（回调callback），当前Javascript block后面的script会被自动Drop忽略掉，不被执行。   

```html
<html xmlns="http://www.w3.org/1999/xhtml">  
<head>  
<title>Test</title>  
    <script type="text/javascript">  
    window.onerror = function(message, url, line)  
    {  
        alert("Error. \n Message:"+ message +"\n Url:" + url + "\n Line:" + line)  
        return true;  
    }  
    </script>  
    </head>  
    <body>  
    <script type="text/javascript">  
        test(); 
        test(); 
        test(); 
        test(); 
    </script>  
    <script type="text/javascript">  
        test(); 
        test(); 
        test(); 
        test(); 
    </script>  
</body>  
</html>  
```
在上面的例子中只会有每一个block中的第一个`test()`; 产生 error。触发 `window.onerror` 回调，后面的Javascript会被忽略掉。`img` 也支持 `onerror <img src="pic.gif" onerror= "javascript:alert("An error occurred.");"/>`。`onerror` 是浏览器支持的对象。由浏览器决定是否可以使用，不是 DOM 标准。 

####  使用Javascript中的 `try catch throw` 处理异常

> Javascript支持了try catch throw，Javascript中定义的异常：
1. EvalError: An error occurs in the `eval()` function.  
1. RangeError: A number value is greater then or less then the number that can be represented in Javascript(`Number.MAX_VALUE` and `Number.MIN_VAKUE`).  
1. ReferenceError: An illegal reference is used.  
1. SyntaxError: A syntax error occus inside of an eval() function call. All other syntax error are reorted by the browser and cannot be handled with a try...catch statement.  
1. TypeError. A variables type is unexpected. 
1. URIError. An error ocuurs in the `encodeURI()` or the `decodeURI()` function.  

```html
<script type="text/javascript">  
function CreateError()  
{  
    throw new Error("Created error by custom."); 
}  
try  
{   
    //throw a error from a function just want to see the call stack in firefox.  
    CreateError(); 
}  
catch(error)  
{  
    var errorMsg = ("Message: " + error.message + "\n"); 
    if(typeof(error.stack)!=undefined)  
    {  
        //FF  
        errorMsg += ("Line Number: " + error.lineNumber + "\n");  
        errorMsg += ("File Name: " + error.fileName + "\n");  
        errorMsg += ("Stack Trace:\n" + error.stack + "\n");  
    }  
    else  
    {  
        //IE  
        errorMsg += ("Description: " + error.description + "\n");  
        errorMsg += ("Number: " + error.number + "\n");  
    }  
    alert(errorMsg); 
}  
finally  
{  
    alert("End try catch.message from finally block."); 
}  
</script>  
```
---  

`Error.message`是 IE 和 FireFox 都支持的属性。  
IE支持 description 和 number属性。  
FF支持 fileName lineNumber 和 stack 属性。  
由于 Javascript 是弱类型的语言，所以在 `catch` 部分只能 `catch` 一次，不能像 C# 这样的语言可以写多个 `catch`，`catch` 不同类型的 `exception`。  
但是可以用 `instanceof ErrorType` 的方式实现类似的功能。  

```html
<script type="text/javascript">  
try  
{ 
    //Syntax Error  
    //eval("alert a"); 
    //Custom Error  
    throw new Error("An error occured."); 
}  
catch(error)  
{  
    if(error instanceof SyntaxError)  
    {  
        alert("Syntax Error"); 
    }  
    else if(error instanceof EvalError)  
    {  
        alert("Eval Error"); 
    }  
    else if(error instanceof RangeError)  
    {  
        alert("Range Error"); 
    }  
    else if(error instanceof ReferenceError)  
    {  
        alert("Reference Error"); 
    }  
    else if(error instanceof TypeError)  
    {  
        alert("Type Error"); 
    }  
    else if(error instanceof Error)  
    {  
        alert("Custon Error"); 
    }
    
    alert(error.message); 
}  
</script>  
```

注：浏览器不会抛出 `Error` 类型的 `exception` 异常，所以如果捕获到 `Error` 类型的异常，可以确定这个异常是用户代码抛出的，不是浏览器抛出的。 

