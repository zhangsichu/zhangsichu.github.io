---
title: CoffeeScript和Sass提高Web开发效率
date: 2011-06-26 13:36:28 + 0080
category: [Web开发]
tags: [Web, Performance, Software Development]
image:
  path: /assets/attachments/2011/06/26_132843_sphvsass.gif
  show_top: false
---

如果您是一位每天都要编写 `JavaScript` 和 `Css` 的 **Web** 前端开发人员，可能您已经开始感觉到`JavaScript`的关键字 `var, function, {}` 要被您每天敲击若干遍。是否可以省掉这些重复的敲击。编写 `Css`，先要一层一层的选到元素，然后开始写样式，如果要写下一层的样式，又要重复的选一次父层元素然后再到子层，`Css`是否可以嵌套呢。  

 **下面是同样功能的CoffeeScript和JavaScript的代码对比**  

![CoffeeScript and JavaScript](/assets/attachments/2011/06/26_132831_rohvcs1.gif)  

 **同样功能的Sass代码和Css代码的对比**  

![Sass and Css](/assets/attachments/2011/06/26_132843_sphvsass.gif)  

是不是`CoffeeScript`和`Sass`更加的简洁易懂，同时又省了很多代码? `CoffeeScript`和`Sass`都采用了简洁的`Ruby`语法风格，都是用代码生成代码，即用右边的`CoffeeScript`代码生成左边的`JavaScript`代码，用`Sass/Scss`代码生成`Css`代码。这两个`Library`的作者都想用新的代码方式来省去一些重复的，有些“铺张”的代码。  

CoffeScript: http://jashkenas.github.com/coffee-script/  
**CoffeeScript的一些有用特性:**   
1. Lexical Scoping and Variable Safety  
2. If, Else, Unless, and Conditional Assignment  
3. The Existential Operator  
4. Classes, Inheritance, and Super  
5. Function binding  
6. Extended Regular Expressions  


Sass: http://sass-lang.com/  
**Sass 的一些有用特性:**      
1. Variables: 变量以`$`开始，它能定义 颜色，数字，或者文字。  
2. Nesting: 嵌套，将选择器嵌入到其他层级的选择器。  
3. Mixins: 混合类型，允许抽象出性质的共同点，然后命名并且加入到选择器中。  
4. Selector Inheritance: 继承，继承其它选择器的属性。  
5. Functions: 函数，支持简单的算术操作，如 `+-×/`，及函数。如：将某颜色亮度增加`10%` `lighten(red, 10%)`。  

