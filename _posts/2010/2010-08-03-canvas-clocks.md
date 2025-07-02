---
title: Canvas Clocks (钟表)
date: 2010-08-03 15:59:40 + 0080
category: [Web开发]
tags: [Web, Design, Performance, 大制作]
image: 
  path: /assets/attachments/2010/08/03_155852_he7kColorfulClock.gif
  show_top: false
---

`Canvas` 是 **Html5** 中非常重要的 **Feature** 之一，究竟 `Canvas` 的未来会怎么样? 各大巨头有着不同的想法，微软的 **IE9** 会全面支持 `Canvas`, **Safari** **Chrome** **FireFox** **Opera** 都已经支持了 `Canvas`, 这些都是对 `Canvas` 利好的消息，这说明`Canvas` 将会在主流的浏览器上得到全面的支持。不过不全是对 `Canvas` 利好的消息。

**Adobe** **微软** 都有自己成熟的替代技术，`Adobe Flash` 已经发展了这么多年，拥有广大的用户群，同时`Flash` 的浏览器插件也几乎成为了事实标准，同时 Flash 拥有强大的图形处理能力，和良好的 IDE 开发工具，这都会让人不由的想选择Flash来实现类似的图形效果。微软的 `SilverLight` 不断的更新和发展，这也说明了微软想发展这项技术的决心。乔布斯不让 IPhone 和IPad 支持 Flash，但是 Google 最新的 Android 2.2 已经支持了 Flash，看来这两家巨头在移动设备上的做法不太一样，但是 Apple 和 Google 没有类似的替代技术，看来他们会坚定不移的发展并支持 `Canvas` 技术，这两家巨头会带着`Canvas` 走向何处，`Canvas` 会大方异彩被广大的 Web 开发人员接收并采用，还是黯然的躲在角落里，我想一段时间后，这个答案会慢慢的浮出水面吧。  

经典的Html5 Canvas 例子已经很多，这里的两个 Clock 创意并非来自于本文，ColorfulClock 来自于 `http://demo.tutorialzine.com/2009/12/colorful-clock-jquery-css/demo.html`  CharacterClock 来自于 `http://www.j2nete.cn/time/time.html` 非常喜欢这两个 Clock 创意，这里使用 `Canvas` 来实现了它们，希望各位看官能够喜欢。  

[**实例执行页面**](/assets/playground/canvas-clocks/canvas-clocks.html){:target="_blank"} ie7 ie8 没有支持 `Canvas`, 请在 Safari Chrome FireFox 或 Opera 下运行此实例页面。  
![](/assets/attachments/2010/08/03_155852_he7kColorfulClock.gif)  

`ColorfulClock` 的核心代码是 `ColorfulRing` 的 `drawValue` 方法，使用 `Canvas` 的 `path` 创建路径并填充路径。  

```js
ColorfulRing.prototype.drawValue = function (value) { 

    var angleStart = 1.5 * Math.PI; 
    var angleEnd = value / this.threshold * 2 * Math.PI + 1.5 * Math.PI; 
    var clearSafe = 10; 

    this.context.save(); 
    this.context.clearRect(this.positionX - this.radius - clearSafe, this.positionY - this.radius - clearSafe, (this.radius + clearSafe) *2, (this.radius + clearSafe) * 2);  
    this.context.beginPath(); 
    this.context.arc(this.positionX, this.positionY, this.radius, angleStart, angleEnd, false); 
    this.context.lineTo(this.positionX + Math.cos(angleEnd) * this.radiusInner, this.positionY + Math.sin(angleEnd) * this.radiusInner);  
    this.context.arc(this.positionX, this.positionY, this.radiusInner, angleEnd, angleStart, true); 
    this.context.lineTo(this.positionX + Math.cos(angleStart) * this.radius, this.positionY + Math.sin(angleStart) * this.radius);  
    this.context.closePath(); 

    this.context.strokeStyle = this.borderColor; 
    this.context.lineWidth = this.borderWidth; 
    this.context.stroke(); 

    this.context.fillStyle = this.fillColor; 
    this.context.fill(); 

    this.context.fillStyle = this.textColor; 
    this.context.font = this.textWeight + " " + this.textSize + " " + this.textFamily; 
    this.context.fillText(value < 10 ? "0" + value : value, this.positionX - parseInt(this.textSize) / 2 - parseInt(this.textSize) / 14, this.positionY + parseInt(this.textSize) / 3 + parseInt(this.textSize) / 14);  
    this.context.restore(); 

    this.value = value; 
}  
```

`CharacterClock` `Canvas` 主要使用 `fillText` 来绘制文字，核心的时间显示算法。  

![CharacterClock](/assets/attachments/2010/08/03_155830_liaoCharacterClock.gif)  

两个 `Canvas` Clock在 Chrome 下分别和DOM实现做了粗略性能比较:  

![canvas performance](/assets/attachments/2010/08/03_155910_74v0performance.gif)  

`似乎可以看出，Canvas` 在这个用例上，有一点小小的优势。  

[**实例执行页面**](/assets/playground/canvas-clocks/canvas-clocks.html){:target="_blank"} 如果需要下载可以直接保存这个页面，页面中没有引用其他资源。  

