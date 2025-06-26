---
title: CSS2盒模型[转载]
date: 2005-07-23 08:55:56 + 0080
category: [平面设计]
tags: [Design, CSS]
---

CSS布局与传统表格`(table)`布局最大的区别在于：原来的定位都是采用表格，通过表格的间距或者用无色透明的GIF图片来控制文布局版块的间距；而现在则采用层`(div)`来定位，通过层的`margin,padding,border`等属性来控制版块的间距。  

### 定义DIV  
分析一个典型的定义div例子：
```css
#sample { 
    MARGIN: 10px 10px 10px 10px;  
    PADDING:20px 10px 10px 20px;   
    BORDER-TOP: #CCC 2px solid;  
    BORDER-RIGHT: #CCC 2px solid;  
    BORDER-BOTTOM: #CCC 2px solid;  
    BORDER-LEFT: #CCC 2px solid;
    BACKGROUND: url(images/bg_logo.png) #FEFEFE no-repeat right bottom;  
    COLOR: #666;  
    TEXT-ALIGN: center;  
    LINE-HEIGHT: 150%; WIDTH:60%; 
}
```   
说明如下：
层的名称为(id) sample，在页面中用 `<div id="sample">` 就可以调用这个样式。

MARGIN 是指层的边框以外留的空白，用于页边距或者与其它层制造一个间距。`"10px 10px 10px 10px"` 分别代表"上右下左"(顺时针方向)四个边距，如果都一样，可以缩写成 `"MARGIN: 10px;"`。如果边距为零，要写成`"MARGIN: 0px;"`。注意：当值是零时，除了RGB颜色值 0% 必须跟百分号，其他情况后面可以不跟单位 `"px"`。MARGIN是透明元素，不能定义颜色。

PADDING 是指层的边框到层的内容之间的空白。和 margin 一样，分别指定上右下左边框到内容的距离。如果都一样，可以缩写成 `"PADDING:0px"` 。单独指定左边可以写成 `"PADDING-LEFT: 0px;"`。PADDING 是透明元素，不能定义颜色。

BORDER 是指层的边框，`"BORDER-RIGHT: #CCC 2px solid;"` 是定义层的右边框颜色为 `"#CCC"`，宽度为 `"2px"`，样式为 `"solid"` 直线。如果要虚线样式可以用 `"dotted"`。

BACKGROUND 是定义层的背景。分2级定义，先定义图片背景，采用 `"url(../images/bg_logo.png)"` 来指定背景图片路径；其次定义背景色 `"#FEFEFE"`。`"no-repeat"` 指背景图片不需要重复，如果需要横向重复用`"repeat-x"`, 纵向重复用`"repeat-y"`, 重复铺满整个背景用 `"repeat"`。后面的 `"right bottom;"` 是指背景图片从右下角开始。如果没有背景图片可以只定义背景色 `BACKGROUND: #FEFEFE`

COLOR 用于定义字体颜色，上一节已经介绍过。   

TEXT-ALIGN 用来定义层中的内容排列方式，center居中,left居左,right居右。LINE-HEIGHT 定义行高，150% 是指高度为标准高度的150%，也可以写作：`"LINE-HEIGHT:1.5"` 或者`"LINE-HEIGHT:1.5em"`，都是一样的意思。 

WIDTH 是定义层的宽度，可以采用固定值，例如`500px`，也可以采用百分比，象这里的 `60%`。要注意的是:这个宽度仅仅指你内容的宽度，不包含margin, border和padding。但在有些浏览器中不是这么定义的，需要你多试试。我们可以看到边框是`2px`的灰色，背景图片在右下没有重复，内容距离上和左边框`20px`，内容居中，一切和预想的一样。

### CSS2盒模型  
自从1996年CSS1的推出，W3C组织就建议把所有网页上的对像都放在一个盒(box)中，设计师可以通过创建定义来控制这个盒的属性，这些对像包括段落、列表、标题、图片以及层 `<div>`。

盒模型主要定义四个区域：内容(content)、边框距(padding)、边界(border)和边距(margin)。上面我们讲的sample层就是一个典型的盒。对于初学者，经常会搞不清楚margin，background-color，background-image，padding，content，border之间的层次、关系和相互影响。这里提供一张盒模型的3D示意图，希望便于你的理解和记忆。

![CSS Box Model](/assets/attachments/2005/07/23_192330_vskycssbox3d.gif)  

### 辅助图片一律用背景处理  
用XHTML+CSS布局，有一个技术一开始让你不习惯，应该说是一种思维方式与传统表格布局不一样，那就是：所有辅助图片都用背景来实现。类似这样：  `BACKGROUND: url(images/bg_logo.png) #FEFEFE no-repeat right bottom;` 尽管可以用`<img>`直接插在内容中，但这是不推荐的。这里的"辅助图片"是指那些不是作为页面要表达的内容的一部分，而仅仅用于修饰、间隔、提醒的图片。例如：相册中的图片、图片新闻中的图片，上面的3d盒模型图片都属于内容的一部分，它们可以用`<img>`元素直接插在页面里，而其它的类似logo，标题图片，列表前缀图片都必须采用背景方式或者其他CSS方式显示。  
这样做的原因有2点：
1. 将表现与结构彻底相分离(参考阅读另一篇文章：《理解表现与结构相分离》)，用CSS控制所有的外观表现，便于改版。   
1. 使页面更具有易用性，更有亲和力。例如：盲人使用屏幕阅读机，用背景技术实现的图片就不会被朗读出来。   

[原文链接](https://www.w3cn.org/article/step/2004/34.html)

