---
title: Bom 知识小结
date: 2007-02-05 20:34:36 + 0080
category: [Web开发]
tags: [Web, Design]
image:
  path: /assets/attachments/2007/02/05_202945_xun2bom.jpg
  show_top: false
---

本文内容七拼八凑，内容来自不同地方。经过自己整理。  
Dom 对象经常被讨论。还有一个很重要的对象Bom―Browser Object Module。  
![BOM](/assets/attachments/2007/02/05_202945_xun2bom.jpg)  

1．Top 和Parent 指向的内容是不同的。Top一定指向最外面的那个Window。而Parent指向当前frame的Parentframe。因为浏览器窗口自身被看作所有顶层框架的父框架。  

2．self一个更加全局化的窗口指针，它总是等于window（加入它是因为它比parent更合适。它澄清了正在使用的不是框架的父框架，而是它自身）。如果页面上没有框架，window和self就等于top，frames集合的长度为0。  

3．window对象对操作浏览器窗口（和框架）很有用。有四种方法操作窗口：  
(1) moveBy(dx,dy)――把浏览器窗口相对当前位置水平移动dx个像素，垂直移动dy个像素。dx值为负数，向左移动窗口，dy值为负数，向上移动窗口。  
(2) moveTo(x,y)――移动浏览器窗口，使它的左上角位于用户屏幕的(x,y)处。可以使用负数，不过这样会把部分窗口移出屏幕的可视区域。  
(3) resizeBy(dw,dh)――相对于浏览器窗口的当前大小，把它口的宽度调整dw个像素，高度调整dy个像素。dw为负数，把缩小窗口的宽度，dy为负数，缩小窗口的高度。  
(4) resizeTo(w,h)――把窗口的宽度调整为w，高度调整为h。不能使用负数。  
(5) IE提供了window.screenLeft和window.screenTop对象来判断窗口的位置，但未提供任何判断窗口大小的方法。用document.body.offsetWidth和document.body. offsetHeight属性可以获取视口的大小（显示HTML页的区域），但它们不是标准属性。  
(6) Mozilla提供window.screenX和window.screenY属性判断窗口的位置。它还提供了window.innerWidth和window.innerHeight属性来判断视口的大小，window.outerWidth和window.outerHeight属性判断浏览器窗口自身的大小。  

4．window.open()方法打开新的窗口。window.open()有三个参数。如果用已有框架的名字作为window.open()方法的第二个参数调用它，那么URL所指的页面就会被载入该框架。如果声明的框架名无效，window.open()将打开新窗口，该窗口的特性由第三个参数（特性字符串）决定。如果省略第三个参数，将打开新的浏览器窗口，就像点击了target被设置为_blank的链接。这意味着新浏览器窗口的设置与默认浏览器窗口的设置（工具栏、地址栏和状态栏都是可见的）完全一样。  

5． Alert()的兄弟confirm() prompt()。Prompt返回值是文本框中的值。这三种对话框都是系统窗口，意味着不同的操作系统（有时是不同的浏览器）显示的窗口可能不同。这也意味着不可能控制窗口的字体、颜色等外观。  

6．操作状态栏。状态栏告诉了用户何时在载入页面，何时完成载入页面,对应window.status和window.defaultStatus属性。status可以使状态栏的文本暂时改变，defaultStatus可在用户离开当前页面前一直改变该文本。  

7．调用setTimeout()时，它创建一个数字暂停ID，与操作系统中的进程ID相似。暂停ID本质上是要延迟的进程的ID，在调用setTimeout()后，就不应该再执行其它的代码。要取消还未执行的暂停，可调用clearTimeout()方法，并将暂停ID传递给它。在执行一组指定的代码前等待一段时间，则使用暂停。用循环setTimeout()可以实现反复调用。如果要反复执行某些代码，就使用时间间隔。SetInterval(),清除使用clearInterval()。  

8．Histroty.length 反映了历史的多少。  

9．document.write和document.writeln方法帮助Render。如果任何一个方法是在页面载入后调用的，它将抹去页面的内容，显示指定的内容。  

10．location对象。BOM中最有用的对象之一是location对象，它是window对象和document对象的属性（对此没有什么标准，导致了一些混乱）。location对象表示载入窗口的URL，此外，它还可以解析URL：  
(1) hash――如果URL包含#，该方法将返回该符号之后的内容。  
(2) host――服务器的名字（如www.zhangsichu.com）。  
(3) hostname――通常等于host，有时会省略前面的www。  
(4) href――当前载入的页面的完整URL。  
(5) pathname――URL中主机名后的部分。  
(6) port――URL中声明的请求的端口。默认情况下，大多数URL没有端口信息，所以该属性通常是空白的   
(7) protocol――URL中使用的协议，即双斜杠（//）之前的部分。例如，https://www.zhangsichu.com 中的protocol属性等于https: ftp://www.zhangsichu.com 的protocol属性等于ftp:。  
(8) search――执行GET请求的URL中的问号（?）后的部分，又称为查询字符串。   
(9) location.href是最常用的属性，用于获取或设置窗口的URL（在这一点上，它类似于document.URL属性）。改变该属性的值，就可导航到新页面。采用这种方式导航，新地址将被加到浏览器的历史栈中，放在前一个页面后，意味着Back按钮会导航到调用了该属性的页面。assign()方法也可实现同样的操作。如果不想让包含脚本的页面能从浏览器历史中访问，使用replace()方法。该方法所作的操作与assign()方法一样，但它多了一步操作，即从浏览器历史中删除包含脚本的页面，这样就不能通过浏览器的Back和Forward按钮访问它了。location对象还有个reload()方法，可重新载入当前页面。reload()方法有两种模式，即从浏览器缓存中重载，或从服务器端重载。如果是false，则从缓存中载入，如果是true，则从服务器端载入（如果省略参数，默认值为false）。  

11．navigator对象。  
(1) appCodeName――浏览器代码名的字符串表示（如"Mozilla"）。  
(2) appName――官方浏览器名的字符串表示。  
(3) appMinorVersion――额外版本信息的字符串表示。  
(4) appVersion――览器版本信息的字符串表示。  
(5) browserLanguage――浏览器或操作系统的语言的字符串表示。  
(6) cookieEnabled――说明是否启用了cookie的Boolean值。  
(7) cpuClass――CPU类别的字符串表示（"x86"、"68K"、"Alpha"、"PPC"或"other"）。  
(8) javaEnabled()――说明是否启用了Java的Boolean值。  
(9) language――浏览器语言的字符串表示。  
不是每个浏览器都支持这些属性。  

12．screen对象通常包含下列属性。  
(1) availHeight――窗口可以使用的屏幕的高度（像素），其中包括操作系统元素（如Windows工具栏）需要的空间。  
(2) availWidth――窗口可以使用的屏幕的宽度（像素）。  
(3) colorDepth――用户表示颜色的位数。大多数系统采用32位。  
(4) height――屏幕的高度(像素)。  
(5) width――屏幕的宽度(像素)。 

