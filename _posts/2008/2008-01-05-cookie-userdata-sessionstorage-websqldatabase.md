---
title: cookie & userData & sessionStorage & webSqlDatabase
date: 2008-01-05 16:19:41 + 0080
category: [Web开发]
tags: [Web, Database, Debugging, Design]
---

Cookie 是标准的客户端浏览器状态保存方式，可能在浏览器诞生不久就有Cookie了，为什么需要Cookie 这个东东？由于HTTP协议没有状态，所以需要一个标志/存储来记录客户浏览器当前的状态，保证客户浏览器和服务器通讯时可以知道客户浏览器当前的状态。Cookie就是记录这个状态的容器，Cookie在每次请求的时候都被带回到服务器，从而保证了Server可以知道浏览器当前的状态，由于Cookie会被带回到Server，所以Cookie的内容不能存太多，最多不能超过4K，4K 限制的介绍 http://ec.europa.eu/ipg/standards/cookies/index_en.htm   

其中一段内容为：
>  A browser is only required to store up to 300 cookies overall and maintain only the last 20 from each domain. The maximum size of a cookie is 4K of disk space.  

但是在一些场景下可能需要存储超过4K或者更多的数据，但是这些数据不用在每次请求的时候被带回到服务器，只要能在客户的浏览器上保存住，并且可以方便的被Javascript读写就可以了，这种需求尤为在中大型RIA的应用场景下更加的迫切，部分数据放在客户浏览器，节约带宽，提高浏览速度。HTML5标准已经替我们想到了满足这种需求的方案：sessionStorage, webSqlDatabase, 微软的 IE 有 userData 方案。  


### `userData`  
微软对 `userData` 的介绍: http://msdn2.microsoft.com/en-us/library/ms531424(VS.85).aspx  

其中一段内容为：
>Security Alert：For security reasons, a UserData store is available only in the same directory and with the same protocol used to persist the store.  

>Security Alert：Using this behavior incorrectly can compromise the security of your application. Data in a UserData store is not encrypted and therefore not secure. Any application that has access to the drive where UserData is saved has access to the data. Therefore, it is recommended that you not persist sensitive data like credit card numbers. For more information, see Security Considerations: DHTML and Default Behaviors.  
……  

>The userData behavior persists data across sessions, using one UserData store for each object. The UserData store is persisted in the cache using the save and load methods. Once the UserData store has been saved, it can be reloaded even if Microsoft Internet Explorer has been closed and reopened. Setting the userData behavior class on the html, head, title, or style object causes an error when the save or load method is called.  


`userData` 可以在同目录同协议下相互访问，长期存储在客户机器上。最大存储空间也增大了很多。`userData` 需要绑定到一个Dom元素上使用。在 `userData` 的 method 中有 `removeAttribute` 方法。经过测试代码发现 `removeAttribute` 方法好像不是很管用，需要使用像 `cookie` 过期的方式，才可以彻底的删除一个 `userData` `Attribute。`  

在 http://www.itwen.com/04web/11skill/skill20060918/60588.html 中介绍说 `userData` 存储在`X:\Documents and Settings\当前用户\UserData\` 目录下。具体细节MS在 `userData` 说明文档中没有具体说明。  

### `sessionStorage`
HTML5 标准对 `sessionStorage` 的介绍： http://www.whatwg.org/specs/web-apps/current-work/   

其中对 `sessionStorage` 的介绍：
>This specification introduces two related mechanisms, similar to HTTP session cookies [RFC2965], for storing structured data on the client side.  

>The first is designed for scenarios where the user is carrying out a single transaction, but could be carrying out multiple transactions in different windows at the same time.  

>Cookies dont really handle this case well. For example, a user could be buying plane tickets in two different windows, using the same site. If the site used cookies to keep track of which ticket the user was buying, then as the user clicked from page to page in both windows, the ticket currently being purchased would "leak" from one window to the other, potentially causing the user to buy two tickets for the same flight without really noticing.  

>To address this, this specification introduces the sessionStorage DOM attribute. Sites can add data to the session storage, and it will be accessible to any page from that origin opened in that window.  

Html5 `sessionStorage` Demo: http://html5demos.com/storage   
下面是根据 http://www.blogjava.net/emu/archive/2006/10/04/73385.html 中提到的IE FF 兼容userData的测试代码：  

```js
function isIE() { 
    return !!document.all;  
}  

function initUserData() { 
    if (isIE()) document.documentElement.addBehavior("#default#userdata"); 
}  

function saveUserData(key, value) { 
    var ex;  
    if (isIE()) {  
        //IE  
        with (document.documentElement) try {  
            load(key); 
            setAttribute("value", value); 
            save(key); 
            return getAttribute("value"); 
        } catch (ex) { 
            alert(ex.message)  
        }  
    } else if (window.sessionStorage) { 
        //FF 2.0+  
        try {  
            sessionStorage.setItem(key, value)  
        } catch (ex) { 
            alert(ex); 
        }  
    } else {  
        alert("Error occured in user data saving. your browser do not support user data."); 
    }  
}  

function loadUserData(key) { 
    var ex;  
    if (isIE()) {  
        //IE   
        with (document.documentElement) try {  
            load(key); 
            return getAttribute("value"); 
        } catch (ex) { 
            alert(ex.message); return null; 
        }  
    } else if (window.sessionStorage) { 
        //FF 2.0+  
        try {  
            return sessionStorage.getItem(key)  
        } catch (ex) { 
            alert(ex)  
        }  
    } else {  
        alert("Error occured in user data loading. your browser do not support user data.")  
    }  
}  
function deleteUserData(key) { 
    var ex;  
    if (isIE()) {  
        //IE  
        with (document.documentElement) try {  
            load(key); 
            expires = new Date(315532799000).toUTCString(); 
            save(key); 
        }  
        catch (ex) { 
            alert(ex.message); 
        }  
    } else if (window.sessionStorage) { 
        //FF 2.0+  
        try {  
            sessionStorage.removeItem(key)  
        } catch (ex) { 
            alert(ex)  
        }  
    } else {  
        alert("Error occured in user data deleting. your browser do not support user data.")  
    }  
}   
```

`userData` 和 `sessionStorage` 共同的特点就是：这两个对象都可以存储比 `cookie` 大的多的多内容。并且不会随每次请求带回到服务器端。但是根据Html5标准和测试发现 `userData` 和 `sessionStorage` 有很多地方是不同的。  

下面是一个测试页面：  
![test](/assets/attachments/2008/01/05_161910_07ycuserDataSessionStore.gif)  

其中的 `SetInsurance link` 会操作 `javascript` 在IE下用 `userData` 写数据, 在FF下用 `sessionStore` 写数据。在IE下的情况是：关闭IE或者重启机器写入的值都不会丢失。在FF下的情况很有意思：在本页面写入的值在本页面可以访问，在由本页面所打开的其它页面可以访问。但是就算本页面开着，在导航栏里输入地址，打开本页面，存入的值就不能访问了。在本页面存入的值，在它的父页面(打开这个页面的页面)是访问不到的。又看了看 `Html5` `标准。sessionStorage` 的全名是：`Client-side session and persistent storage of name/value pairs` 意思估计是存储在 Client 的内容是有 `session` 会话的，存储的值由 `session` 会话所维系，一旦 `session` 会话中断或者丢失，存入的值也就随之消失了。所以当页面没有session(父页面，由地址栏打开的页面)，是取不到值的。当FF关闭或者重启机器必然也就取不到值了。  

### webSqlDatabase  
`webSqlDatabase` 在 HTML5 标准中是非常 Cool 的一个东东， 用 Javascript 写 SQL查询，数据库就在浏览器里，这在以前几乎不敢想象。不过今天 Safari, Chrome, Opera 都已经支持了，两个 `webSqlDatabase` 的 Demo 页面: http://html5demos.com/database http://html5demos.com/database-rollback   

W3C 对 `WebSqlDataBase` 的介绍页面： http://dev.w3.org/html5/webdatabase/  

WiKi 上一个简明的说明： http://en.wikipedia.org/wiki/Web_SQL_Database   

>...an API for storing data in databases that can be queried using a variant of SQL"  
Web SQL Database is supported by Google Chrome[1], Opera and Safari but will not be implemented by Mozilla(Firefox)[2] who instead propone Indexed Database API access.  

不知道 HTML 5 的 `SQLDB` 会被浏览器支持的怎么样， 不过 `sessionStorage` 看上去已经可以基本满足需求了。  

[**源代码**](/assets/attachments/2008/01/05_164109_xum1CookieVsStorage.rar) 

