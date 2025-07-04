---
title: 响应式设计
date: 2012-06-07 21:59:54 + 0080
category: [Web开发]
tags: [Web, Design, Performance]
image:
  path: /assets/attachments/2012/06/07_215925_liaosreenSize.jpg
  show_top: false
---

### 为什么需要响应式Web设计
**响应式Web设计，这个话题可能是当下Web设计领域里讨论和应用比较多的话题了，为什么要响应式Web设计?什么是响应式Web设计?**  

Web发展迅速，各种应用和服务层出不穷，现在打开电脑，可能使用最多的程序应该是浏览器了，访问不同的网站，可以满足人们购物，社交，获取新闻资讯，娱乐，等等需求。然而近几年内，移动设备快速崛起，移动互联网慢慢进入人们的生活，预计未来5年内移动设备的使用度会超过桌面计算机。所以需要您的网站不仅要在桌面计算机大尺寸屏幕上可以为用户提供友好的UI和用户体验，同时在小尺寸屏幕上也应该可以提供一致的用户体验。使得用户可以在桌面大屏幕上和移动小屏幕上平滑的切换使用，同时没有任何的不适应感觉。  

![mobile trend](/assets/attachments/2012/06/07_215858_b91emobile.png)
_移动设备趋势：http://www.webhostingbuzz.com/blog/2011/10/19/mobile-internet-trends/_

要网站在桌面大尺寸屏幕上和移动小尺寸屏幕上提供一致的用户体验，最直接的方法就是为每种设备及分辨率制作一个网站或者特定的页面，使得移动用户在这些页面里取得平滑友好的用户体验。但是到底有多少不同的移动设备和屏幕分辨率呢?这种方法需要投入多少成本能?  

![early data](/assets/attachments/2012/06/07_215925_liaosreenSize.jpg)
_早先的数据：2005至2008年市场中的400余种移动设备的统计情况(http://www.quirksmode.org/mobile/mobilemarket.html)_

这份统计结果已经比较早了，随着时间的推移，又有很多移动设备投入市场，为每种设备及分辨率制作一个网站或者特定的页面，这应该是比较大的工作量，是比较耗时耗费资源的。是否可以只做一个网站一套页面，既满足桌面大尺寸屏幕，同时也可以满足各种不同移动设备的小尺寸屏幕。  

因为有了这个问题，才有了响应式Web设计这种方案：一个网站能够兼容多种移动设备屏幕尺寸，而不是为每种屏幕尺寸做一个特定的版本。这个概念可以说是为移动互联网而生的。国外已经有一些这样的应用例子了,如: http://foodsense.is/ 此网站在 Android 上的效果：  

![response web in android](/assets/attachments/2012/06/07_220058_1xp4Android.png)  

不采用响应式Web设计 news.sina.com.cn 在 Android 上的效果，需要用双指进行缩放才能友好浏览：  

![sina in mobile](/assets/attachments/2012/06/07_220129_a8zdsina.png)  

foodsense.is 在其它设备分辨率下的情况:  

![foodsense in mobie](/assets/attachments/2012/06/07_220301_b91eipadLandscape.png)
_iPad1/2 1024X768 横向_  

![foodsense in mobie](/assets/attachments/2012/06/07_220240_pmetipadPortrait.png)
_iPad1/2 1024X768 纵向_

![foodsense in mobie](/assets/attachments/2012/06/07_220431_2yr6iphone4landscape.png)
_iPhone4 320X480 横向_

![foodsense in mobie](/assets/attachments/2012/06/07_220446_zwo3iphone4portrait.png)
_iPhone4 320X480 纵向_

![foodsense in mobie](/assets/attachments/2012/06/07_220500_oleswin7.png)
_ASUS Galaxy 7 480X800 纵向_

foodsense.is 可以在各种设备分辨率下，根据分辨率的不同做出响应，对菜单和图片进行重新布局，来满足显示的需要。这种技术就是响应式Web设计，这个概念是 **Ethan Marcotte** 在 **A List Apart** 发表的一篇文章 **Responsive Web Design** http://www.alistapart.com/articles/responsive-web-design/ 中援引响应式建筑而得名的: **响应式建筑(responsive architecture)**，物理空间应该可以根据存在于其中的人的情况进行响应。结合嵌入式机器人技术以及可拉伸材料的应用，建筑师们正在尝试建造一种可以根据周围人群的情况进行弯曲、伸缩和扩展的墙体结构,还可以使用运动传感器配合气候控制系统，调整室内的温度及环境光。已经有公司在生产 "智能玻璃"：当室内人数达到一定的阀值时，这种玻璃可以自动变为不透明，确保隐私。” Web借由建筑上这个概念，当设备分辨率发生变化时，根据设备分辨率，调整菜单，图片，文字，等其它页面DOM的状态和布局，使得页面仍然可以为用户提供友好的使用体验。  

 **如何让自己的网站也响应式Web设计，可以响应设备的分辨率呢? 根据 Ethan Marcotte 的文章，和相关的实践，已经总结出了一些实践方法。（本文最后列出了所引用的文章和工具）响应式 Web 设计是想把固定的 `Fixed` 设定(位置定位，长宽大小) 变为 相对的(Relative)设定，其包括三个主要手段: `Fluid Grid` (流体表格), `Liquid Image` (液态图片), `CSS3 Media Queries` (媒体选择器)。**  

---

### Fluid Grid (流体表格)
在流体表格之前主要使用 `960px` 宽度来设定页面的宽度，因为当时主流的桌面分辨率是 `1024X768`, `960px` 宽度可以充分的使用 `1024px` 的宽度同时又不会使用户感觉页面过满。随着屏幕分辨率的不断变大，演化出了 `960Grid` http://www.designinfluences.com/fluid960gs/ `960Grid` 可以占据页面适度的宽度，同时随着页面宽度的变化进行重新排布，流体表格的定义: http://www.alistapart.com/articles/fluidgrids/ 流体表格将页面栅格化，使用 `em` 相对单位取代 `px` `绝对单位，em` 是 `target ÷ context = result`，最好使用 `em` 设定位置偏移和字体大小，这样可以使页面布局和字体大小随页面宽度的变化而变化，从而适应页面宽度的变化。同时使用 `div` 的 `float` 排布，如果要三列排布，将 `div` 设置为 `float:left;width:33%` 这样当宽度变化时，这三个 `div` 也一直会在自己所在的 `block` 里排成三列。流体表格保证了页面响应宽度变化，同时不出现横向滚动条。在 `960Grid` 的 Demo 页面里，第一行使用了`width:23%` 四行排布:

![960Grid](/assets/attachments/2012/06/07_221000_b91f960GridDemo.png)  

![960Grid](/assets/attachments/2012/06/07_221014_2yq5960L.png)
_不同分辨率下的960Grid - 600X800的960Grid_

![960Grid](/assets/attachments/2012/06/07_221018_nkcq960H.png)
_1280X768的960Grid_

除了 `960Grid` 还有 `1140Grid` `Golden Grid System` 等其它流体表格框架。  
1. Fluid 960 Grid System http://www.designinfluences.com/fluid960gs/  
1. 1140 CSS Grid System http://cssgrid.net/  
1. Golden Grid System http://goldengridsystem.com/  
1. Frameless http://framelessgrid.com/  

---

### Liquid Image (液态图片)  
流体表格提供了响应式的页面布局，但如何响应图片，分辨率变化时，图片如何友好显示? 液态图片 (Liquid Image) 使得图片响应分辨率变化，让图片不失真的缩放和背景裁剪，提供友好的显示。Zoe Mickley Gillenwater的《Flexible Web Design: Creating Liquid and Elastic Layouts with CSS》基本上介绍了所有的液态图片技巧，同时在他的Blog上http://zomigi.com/blog/ 提供了很多关于创建流体表格和液态图片的教程、资源、创意指导及最佳实践。在 Zoe的http://zomigi.com/blog/hiding-and-revealing-portions-of-images/ 中指出了是把图片当成内容使用 `img` 标签引入，还是图片只是装饰的判断原则。
1. Does the image convey information that I ought to put as text in an alt attribute?  
1. Do I want to make sure the image always prints because without it the printout wouldn’t make sense or be complete?  
1. Do I want to link the image?  
If the answer to any of these questions is yes, the image is content and should be kept in the (X)HTML.   

从当前实践的情况来看，如果把图片当成内容来处理，是不易进行缩放和裁剪的，也就不好响应分辨率变化，但是如果把图片当成装饰(DOM的背景)来处理，就可以方便响应分辨率变化，进行缩放或者裁剪。  

如: Demo: http://www.zomigi.com/demo/crop_background.html  
```css
div#background {  
    width: 50%;  
    height: 330px;  
    background: url(styx.jpg) no-repeat right;  
    border: 2px solid #000;  
}  
```  

简单的 `background: url(styx.jpg) no-repeat right;` **right** 设置使得浏览器在缩小宽度时，对图片裁剪:  
裁剪前:
![css3 image using right](/assets/attachments/2012/06/07_221509_63u9imgCutBefore.png)  

裁剪后:  
![css3 image using right](/assets/attachments/2012/06/07_221518_sphwimgCutEnd.png)  

在 http://zomigi.com/blog/foreground-images-that-scale-with-the-layout/ 中给出了 `img width` 的使用技巧:
```css
img {  
    width: 50%;
}  
```  
Demo: http://www.zomigi.com/demo/scale_liquid.html 图片随着 `Html Body` 宽度缩放。  
```css
img {  
    width: 20em;  
    max-width: 500px;  
}  
```  
http://www.zomigi.com/demo/scale_elastic_max.html 图片随着字体大小缩放。  

在 http://zomigi.com/blog/creating-sliding-composite-images/ 中给出了 `max-width` 的使用技巧:  

```css
#outer {  
    position: relative;  
    width: 100%;  
    max-width: 1000px;  
    height: 300px;  
    background: url(skyline.jpg) no-repeat;  
}  

#inner {  
    position: absolute;  
    top: 50px;  
    right: 50px;  
    width: 100px;  
    height: 250px;  
    background: url(ufo.png) no-repeat;  
}  
```  

Demo: http://www.zomigi.com/demo/composite.html 随着宽度缩小，`outer img` 裁剪， `inner img` 向左移动，保持 `right 50px`。  
缩放前:
![css image using outer inner](/assets/attachments/2012/06/07_223138_pmesimgScaleBefore.png)  

缩放后:  
![css image using outer inner](/assets/attachments/2012/06/07_223146_3zr6imgScaleEnd.png)  

**Ethan Marcotte** 在 http://unstoppablerobotninja.com/entry/fluid-images/ 中也说明了: `img { max-width: 100%;}` 的使用技巧。因为图片已经经过响应式的 CSS 设定，所以应该在 iPhone 及 iPodTouch 中，禁止图片被自动缩放，Apple 专有的 `meta` 标记可以解决这个问题。在页面的 `<head>` 部分添加以下代码(Think Vitamin的文章：http://thinkvitamin.com/design/responsive-design-image-gotcha/):
`<meta name="viewport" content="width=device-width; initial-scale=1.0">`  

将`initial-scale`的值设定为 `1`，即可覆盖默认的缩放方式，保持原始的尺寸及比例。  
未设置`initial-scale`:    
![css initial-scale](/assets/attachments/2012/06/07_223359_zwo4iphoneNoMeta.png)  

设置`initial-scale` 为 `1`:    
![css initial-scale](/assets/attachments/2012/06/07_223352_urjyiPhoneMeta.png)  

---

### CSS3 Media Queries (媒体选择器)
流体表格提供了响应式的页面布局，但是当在某种小分辨率下，确实无法进行**4**行内容显示了，需要变为**3**行内容显示，或者**2**行，如何响应分辨率，将原来的**4**行显示平滑的变成**3**或者**2**行显示呢? **CSS3 Media Queries(媒体选择器)**可以用来解决这个问题。 

CSS3 Media Queries 可以根据不同的分辨率加载不同的 CSS。 在**Ethan Marcotte**的 http://www.alistapart.com/articles/responsive-web-design/ 中给出了使用方法。http://www.alistapart.com/d/responsive-web-design/ex/ex-site-FINAL.html 在页面宽度变化时，下方的图片自动重排且图片大小适中。  
![css media queries](/assets/attachments/2012/06/07_224040_sphvmediaQueryA.png)  

![css media queries](/assets/attachments/2012/06/07_224052_urjxmediaQueryB.png)  

![css media queries](/assets/attachments/2012/06/07_224101_urjymediaQueryC.png)  
```css
@media (max-width: 400px) {
    .figure, li#f-mycroft {  
        margin-right: 3.317535545023696682%; /* 21px / 633px */  
        width: 48.341232227488151658%; /* 306px / 633px */  
    }  
}  
@media (min-width: 1300px){
    .figure, li#f-mycroft {  
        margin-right: 3.317535545023696682%; /* 21px / 633px */  
        width: 13.902053712480252764%; /* 88px / 633px */  
    }  
}  
```

CSS3媒体选择器根据当前媒体的`min-width`来加载不同的`li#f-mycroft`样式，从而设置`width`和`maright-right`,把原来最宽的单行布局变成了最窄的两行布局。CSS3媒体选择器除了宽度选择还有很多其它的Media features, http://www.w3.org/TR/css3-mediaqueries/ 给出了介绍。  

---  

### 其它相关内容  
有了：流体表格，液态图片,媒体选择器，页面已经基本可以响应分辨率变化了，但是就响应式Web设计这个话题来说它应该包括两个方面的内容:  
1. 响应屏幕分辨率变化，分辨率发生变化时，根据设备分辨率，调整菜单，图片，文字，等其它页面DOM的状态和布局，使得页面仍然可以为用户提供友好的使用体验。  
2. 响应设备原生行为变化，如：拖拽(iPad上使用JavaScript事件模拟拖拽)，手势支持，等其它移动设备上特有的手势输入方式支持。 

本文响应式 Web 设计，只针对1。  

同一图片，小分辨率下可否只载入小图，大分辨率才载入大图，可否不同分辨率下提供不同尺寸大小的图片，从而节省带宽? 使用媒体选择器及 `content` 属性可以解决这一问题。  
```html
<img src="image.jpg" data-src-600px="image-600px.jpg" data-src-800px="image-800px.jpg" alt="">  
```
```css
@media (min-device-width:600px) { 
    img[data-src-600px] {   
        content: attr(data-src-600px, url);  
    }  
}  

@media (min-device-width:800px) { 
    img[data-src-800px] {   
        content: attr(data-src-800px, url);  
    }  
}  
```  

是否存在一个简单的步骤，实现一个具备响应式的页面布局? http://webdesignerwall.com/tutorials/responsive-design-in-3-steps 文中给出了一个3步实现响应式布局的例子。  

布置页面:  
![page layout](/assets/attachments/2012/06/07_224451_wtlzpagestructure.png)  

设置媒体选择器:  
![page layout media query](/assets/attachments/2012/06/07_224245_mjbp980pxorless.png)  

![page layout media query](/assets/attachments/2012/06/07_224414_rogv700pxorless.png)  

![page layout media query](/assets/attachments/2012/06/07_224404_07yd480pxorless.png)  

实际页面 Demo: http://webdesignerwall.com/demo/responsive-design/index.html  

使用上面的三个技术可以设计制作出一个响应式Web。从设计和实现的整体过程来说设计并实现一个响应式Web站点，可以经过下面**4**个过程:  
1. 美工，用户体验师，勾画出页面的整体样子，确定最大分辨率下应该显示的内容，在分辨率不断缩小的情况下，如何布局，什么元素(菜单，图片，内容)需要变化显示方式，进行隐藏，缩放或者裁剪。  
1. 使用相对尺寸进行定位和布局，使用相对尺寸设置长度，宽度，字体大小。  
1. 使用流体表格和液体图片响应分辨率。  
1. 由于分辨率变化，根据需要变化显示方式的元素，加入媒体选择器。  

### 相关工具
1. http://mattkersley.com/responsive/  
1. http://resizemybrowser.com/
1. http://seesparkbox.com/foundry/media_query_bookmarklet
1. http://protofluid.com/ 
1. http://quirktools.com/screenfly/
1. http://responsivepx.com/

其中 http://quirktools.com/screenfly/ 非常 cool，可以帮助您模拟测试Web在各种主流设备上的情况：  
![demo tool](/assets/attachments/2012/06/07_224836_zwo3tool.png)  

### 相关资源
1. http://www.alistapart.com/articles/responsive-web-design/  
1. http://www.designinfluences.com/fluid960gs/  
1. http://cssgrid.net/  
1. http://goldengridsystem.com/  
1. http://framelessgrid.com/  
1. http://www.qianduan.net/responsive-web-design.html  
1. http://zomigi.com/blog/hiding-and-revealing-portions-of-images/  
1. http://zomigi.com/blog/creating-sliding-composite-images/  
1. http://zomigi.com/blog/foreground-images-that-scale-with-the-layout/  
1. http://zomigi.com/blog/essential-resources-for-creating-liquid-and-elastic-layouts/  
1. http://unstoppablerobotninja.com/entry/fluid-images/  
1. http://www.netmagazine.com/features/21-top-tools-responsive-web-design  
1. http://www.netmagazine.com/features/50-fantastic-tools-responsive-web-design  
1. http://iskeleton.blogspot.in/  
1. http://www.lukew.com/ff/entry.asp?933  
1. http://dev.opera.com/articles/view/graceful-degradation-progressive-enhancement/  
1. http://www.lukew.com/ff/entry.asp?1509  
1. http://www.lukew.com/ff/entry.asp?1514  
1. http://coding.smashingmagazine.com/2011/01/12/guidelines-for-responsive-web-design/
