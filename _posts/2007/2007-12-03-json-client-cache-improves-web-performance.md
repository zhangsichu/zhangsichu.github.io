---
title: Json客户端Cache提高Web性能
date: 2007-12-03 18:54:20 + 0080
category: [Web开发]
tags: [Web, Cache, Performance, 大制作]
---

经常在讨论或者文章中看到对Json的介绍，介绍使用Json进行客户端Cache，可以大大提高Web的性能，但是介绍的文章对这方面的内容总是提纲挈领的说一下。总是没有个一个具体的应用场景，和全面的解决方案，让人看了总是感觉不过瘾 :(

本文从校内网 `http://xiaonei.com/` 出发，分析校内网的`Json-Cache`应用。争取总结出一个`JsonCache`的应用场景，和一个比较周全的解决方案。  

什么是： `Json(JavaScript Object Notation)` `Json` 官方详细的介绍 http://json.org/ 。  
校内网中提供了一个供用修改用户所在大学的界面。如下图：  

![sample](/assets/attachments/2007/12/03_222306_qnfuJsonCache1.gif)  

用户在这个界面中选择省市，下面会列出这个城市所对应的大学。随着所选择城市的不同，下面对应的大学也跟着变化。这个应用是一个比较标准的二级联动菜单。只是在这个应用场景中第二级菜单的展示方式比较特殊。在一般情况下，这种菜单都是使用Ajax来实现的。MS在Asp.Net Ajax Toolkit中也提供了Ajax的两级联动菜单。当用户更改第一级菜单时,触发JavaScript，根据选择的一级菜单（这里是省市信息）使用Ajax请求服务器，取得第二级的菜单（本省市所包含的大学的信息），绘制界面。  

在校内网的这个界面中，不管你怎么变化省市信息都截取不到浏览器发向服务器的请求。但是大学的信息都能正常显示。这是为什么？观察了校内网的 Html 和 JavaScript http://static.xiaonei.com/js/searchschlist.js?ver=22411.js 后发现，触发的JavaScript并没有使用`XMLHttpRequest`请求服务器,而是在反复的操作一个叫做`allUnivList`的对象，反复遍历这个对象取得大学的数据。   

![code](/assets/attachments/2007/12/03_222314_sphvJsonCache2.gif)  

`allUnivList` 这个对象的定义在 http://static.xiaonei.com/js/allunivlist.js?ver=22411.js 中。打开 http://static.xiaonei.com/js/allunivlist.js?ver=22411.js 只有一行，看来是经过压缩了。  

![code](/assets/attachments/2007/12/03_222324_yvn2JsonCache3.gif)  

就是在这一行中使用Json串存储了所有的大学信息。下载下来这个文件。写一段JavaScript可以打印出所有大学的信息。  
```html
<html>  
<head>  
<title>Test</title>  
<script type="text/javascript" src="allunivlist.js"></script>  
<script type="text/javascript" src="cityArray.js"></script>  
</head>  
<body>  
<script type="text/javascript" language="javascript">  
for(var country=0; country<1 /*allUnivList.length*/; country++) {  
    //Country  
    document.writeln("Country Name: " + allUnivList[country]["name"] + " Country ID: " + allUnivList[country]["id"] + "<br/>"); 

    //Province  
    for(var province=0; province<allUnivList[country].provs.length; province++) {  
        //Build Province  
        document.writeln("ProvinceName:" + allUnivList[country].provs[province]["name"] + "@@@@@ProvinceID:" + allUnivList[country].provs[province]["id"] + "<br/>"); 

        //University  
        for(var university=0; university<allUnivList[country].provs[province].univs.length; university ++) {  
            document.writeln("UniversityName:" + allUnivList[country].provs[province].univs[university]["name"] + "@@@@@UniversityID:" + allUnivList[country].provs[province].univs[university]["id"] + "<br/>"); 
            document.writeln(allUnivList[country].provs[province]["name"] + "::" + allUnivList[country].provs[province]["id"] + "::" + allUnivList[country].provs[province].univs[university]["name"] + "::" + allUnivList[country].provs[province].univs[university]["id"] + "<br/>"); 
        }  

        document.writeln("<br/>"); 
    }
    
    document.writeln("<br/>"); 
}  
</script>  

<script type="text/javascript" language="javascript">  
for(var i=1; i<=34;i++) {  
    var city = eval("_city_"+i); 
    for(var l=0; l< city.length; l++) {  
        document.writeln(i+ ":" +city[l] + "<br/>"); 
    }  
}  
</script>  
</body>  
</html>  
```  

![result](/assets/attachments/2007/12/03_222335_da3hJsonCache4.gif)  

![result](/assets/attachments/2007/12/03_222345_urjxJsonCache5.gif)  

这个`Json`串使用`Array`和`Object`，存储了所有的信息。由于是使用`Json`存储，所以在JavaScript中这个Json串可以自动变成一个`Object`。并且拥有完整的对象和属性。可以方便的在这个对象上进行遍历和查找。 

分析到这里，基本上可以回答：为什么当一级菜单变化时，二级菜单可以不请求服务器就可以得到数据，正确绘制界面的问题了。`allUnivList`对象使用Json串的方式存储了所有的数据，所以JavaScript不用请求服务器，直接查找`allUnivList`对象就可以取得想要的数据了。  

从上面的应用场景中，可以看出`Json`串可以方便的存储简单的数据，就是存贮一组名值串，多个名值串再形成一个数组，再把数组挂在某个名值串的值上，反复嵌套，这个Json串就可以表达比较丰富的数据内容了，基本上可以表达一个简单的关系数据表。但是在查询时是比较麻烦的，需要逐层遍历查找。  

### JsonCache的优点  
1. JsonCache方式和Ajax方式可以容易的相互切换。操作页面Dom元素的JavaScript从一个JavaScript `Object` 中获取数据。这个存储数据的对象可以由Ajax提供，也可以由JsonCache提供。操作Dom的JavaScript只关心这个对象是否被合适的初始化，而不用关心这个对象是由谁提供的。JsonCache用 `.js` 文件初始化对象，Ajax使用`eval (jsonText);`初始化对象，Ajax负责返回这个`jsonText`。
2. JsonCache更新比较方便，比`HardCode`灵活，和Ajax相比减轻了服务器端的压力。校内网的这种二级联动菜单，完全可以HardCode直接写成固定的Html和JavaScript。但是当大学信息更新时，就比较麻烦了，如果使用Ajax，每次操作都会请求服务器，服务器端的压力会比较大。校内网的大学信息应该不会只在一个`.js`文件中维护。估计也是存储在数据库中，当执行某个脚本或者某个生成程序后，那个`.js`文件也就生成了。  

### JsonCache的缺点 
1. 使用JsonCache提高了页面中JavaScript的复杂度。由于需要对JsonCache进行查找遍历，需要写对应的JavaScript，查询JsonCache对象，增加了页面的复杂度，增加了页面的维护成本。  
2. 如果JsonCache中存储了中文，可能需要对JsonCache对象编码，保证中文可以正常显示。  

### 什么场景下使用JsonCache比较好
1. JsonCache 是一种Cache机制，Cache的命中率越高越好。在校内网这个实例中Cache的命中率是100%。所有的数据都没有从Server端取，都直接从JsonCache中取得。JsonCache最好缓存长期不变，并且数据关系并不复杂的数据内容。  

2. JsonCache和Ajax联合使用，开始JsonCache没有内容，当用户要去看某些内容时，用Ajax请求取得，操作Dom展示给用户同时放入JsonCache。下次用户再次要看这部分内容的时候从JsonCache中取得，不发Ajax请求到Server端取。比较合适的应用实例：某些新闻或者个人博客首页，开始只列出每条新闻的摘要，当用户点击某条新闻的详细时，才从服务器取得新闻的全文，此时用户可以点击收起此新闻，当用户再次点击展开此新闻时，从JsonCache中取得。  

3. JsonCache和服务器端缓存的JsonCache `.js`文件自动更新联合使用。服务器端的数据存放在数据库中，当数据更新后，生成JsonCache的js文件，用户访问过这个`.js`文件后，缓存到客户端浏览器。  

[**源代码**](/assets/attachments/2007/12/03_223526_kh0nJasonCache.rar) 

