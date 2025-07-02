---
title: Html5 FileReader 对文件进行Base64编码
date: 2010-11-27 10:11:58 + 0080
category: [Web开发]
tags: [Web, Software Development, Performance]
---

以 `Base64` 进行编码的数据 `Url` 开始越来越广泛的被应用起来，原来做 `Base64` 转换要自己写一个小程序来转，其实**Html5** 的 `FileReader` 的 `readAsDataURL` 方法读取出的数据就已经是 `Base64` 数据格式的 `Url` `了，利用FileReader` 实现一个对本地文件进行读取并且转换为 `Base64` `Url` 的页面也非常简单。  

[**实例执行页面**](/assets/playground/file-reader/file-reader.html){:target="_blank"} 
![test file reader](/assets/attachments/2010/11/27_101142_qnftFileReader.gif)  

最近IPhone比较火，这里用IPhone做了一个背景，选取一个本地文件，拖拽到那个IPhone上面的拖拽区域，下面就会得到对应的Base64 Url 编码。在Chrome和FireFox下通过测试可以正常工作，在大文件测试下Chrome要比FireFox快一些。  

在例子中的那个IPhone背景图片就使用了`data Url`.在实际应用中对于过大文件进行Base64编码的意义其实不是很大，自己测试的结果是，一般编码后整体结果会增大1/3。  

Base64Url 具体介绍：
http://en.wikipedia.org/wiki/Data_URI_scheme  

它的优点和缺点，上面的wiki页面已分析的非常清晰了，其中有一条是：
> It is possible to manage a multimedia page as a single file.

根据Base64 data URI scheme:   
`data:[<MIME-type>][;charset=<encoding>][;base64],<data> `  


可以看到`MIME-type`中支持多种`type`，记得IE中有一个功能是把一个网页保存成一个`.mht`文件，`all in one` 所有的外链资源和页面都保存在一起，只保存成一个文件，这样用户在离线状态下也可以完整的浏览这个页面，FireFox 和 Chrome 没有类似的功能，它们保存整个页面时新建一个和网页同名的文件夹，把外部链接资源都保存到这个文件夹中，同时修改保存页面中链接的位置到这个新建的文件夹。根据`data Url`格式，应该在 FireFox和Chrome下实现这种保存网页`all in one`，只保存成一个文件的功能也不会太难了，完全可以根据`data Url`的格式，将外部链接资源编码成`base64 Url`然后替换原始的`Url`保存成一个单独的`Html`文件。在FireFox 和Chrome的最新版本中还没有这个功能，是否在未来的版本中会加入这个功能，我想他们应该会吧，这种`all in one` 单页面的保存方式方便的将多个资源保存在一个文件里了，说不定已经有了这种FireFox插件，不过我还没有找到。  

Html5 的 `FileReader` 中除了`readAsDataURL` 还有好几个其它的文件读取方法: `readAsBinaryString()` `readAsText()` `readAsArrayBuffer()`  

Html5 FileRead 具体介绍: 
http://www.w3.org/TR/FileAPI/#FileReader-interface  

