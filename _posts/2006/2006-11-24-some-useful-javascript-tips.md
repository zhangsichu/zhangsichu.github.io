---
title: Some useful Javascript tips.
date: 2006-11-24 10:04:57 + 0080
category: [Web开发]
tags: [Web, Software Development]
---

1) The typeof prefix operator returns a string identifying the type of a value。  

![javascript types](/assets/attachments/2006/11/24_100455_da3gtips1.gif)  

2) `calculateOffset()` 方法，计算`div`应该放置的位置。  
```js
function setOffests() { 
    var left = calculateOffsetLeft(<element>); 
    var top = calculateOffsetTop(<element>); 
    // element the need descripted part.  
}  

function calculateOffsetLeft(field){  
    return calculateOffset(field, 'offsetLeft'); 
}  

function calculateOffsetTop(field){
    return calculateOffset(field, 'offestTop');  
}  

function calculateOffset(field, attr){
    Var offset=0; 
    While(field)  
    {  
        offset += field[attr];  
        field = field.offsetParent; 
    }  
}  
```

3) new operator 意义  
`var newObject = new aObject();`
new `aObject()` returns a new object with a link to `aObject.prototype`.  

![js object](/assets/attachments/2006/11/24_101758_63u9tips2.gif)  

每一个 **JavaScript** 对象都有一个内置的属性，名为`ProtoType`，`ProtoType` 属性保存着对另一个 JavaScript 对象的引用，这个对象作为当前对象的父对象。当通过点记法引用对象的一个函数或属性时，若对象上没有这个属性或方法，此时就会使用对象的 `ProtoType` 属性。当出现这种情况时，将检查对象 `ProtoType` 属性所引用的对象，检查看是否有所请求的属性或函数，如果 `ProtoType` 的属性引用的对象也没有所需要的函数或方法，则进一步检查这个对象(prototype属性引用的对象)的prototype属性。依次沿着链向上找，直到找到所要请求的属性或方法，或者到链尾，如果已经到了链尾还没有找到，则返回 undefined。从这种意义上讲，这种继承是一种 has a 关系，不是 is a 关系。  
你可以只在需要的时候才将对象添加属性和函数，而且可以动态的把函数合并在一起。来创建动态全能的对象。  

4) JavaScript 基于类的继承
```js
function createInheritance(parent, child) { 
    var property  
    for(property in parent) { 
        if(!child[property]) { 
            child[property] = parent[property];  
        }  
    }  
}  
```

5) Minification vs Obfuscation  
Reduce the amount of source code to reduce download time.  
Minification deletes whitespace and comments.  
Obfuscation also changes the names of things.  
Obfuscation can introduce bugs.  
Never use tools that cause bugs if you can avoid it.  
