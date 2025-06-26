---
title: Abstract Class VS Interface[一]
date: 2006-01-02 14:44:17 + 0080
category: [面向对象程序设计]
tags: [C#, Design Pattern, Software Development]
---

`Abstract Class` 虚基类 VS `Interface` 接口.在一次面试的时候考官问我说，“在C# 和 Java 中有`AbstractClass`和`Interface`这两种概念，不过不同的语言对他们的描述不同，但是其实质都差不多，你能不能谈谈`AbstractClass`和`Interface`的区别？” 
当时听到这个问题我就傻了，其实我根本不了解他们的区别，只回答说：`AbstractClass`和`Interface`都不能直接实例化，只有继承他们的真正Class才能实例化。后来也一直没有搞清楚他们的区别。  

`DesignPattern` 中有有两个模式一个叫 `DecoratorPattern` 一个叫 `StrategyPattern`。通过在一些实际程序中运用了两个设计模，我对`AbstractClass`和`Interface`有了一些大体的了解，明白了一些`AbstractClass` 和 `Interface`的区别。本文写出了这两个设计模式的实例代码，来说明`AbstractClass`和`Interface`的一些区别。其实总的来说：`AbstractClass`和`Interface`的区别是：`AbstractClass`面向的是类的抽象，它抽象出好多类共有的成员变量，属性，方法。用类的角度来看抽象。`Interface`是站在方法，动作的角度来抽象，抽象出好多类都要执行的某些方法，某些动作。从`Interface`继承的类，保证了这个类必须拥有某些方法，有执行某些动作的能力。从`AbstractClass`继承的类，保证了这个类必须拥有某些的特性。  

`DecoratorPattern`，这个实例想做一个内容装饰者：把一些公用的内容放在`ComponentDecorator`下。在设计时先设计了两个`Interface`来抽象出一些方法，因为在某种情况下调用者更加关心的是`Interface`下实现的方法。  

**IComponent Component Interface**
```c#
using System;
namespace DecoratorPattern  
{  
    /// <summary>  
    /// Summary description for IComponent.  
    /// </summary>  
    public interface IComponent  
    {  
        string Draw(); 
    }  
}  
```

**ICustomComponent CustomComponent Interface**
```c#
using System; 
namespace DecoratorPattern  
{  
    /// <summary>  
    /// Summary description for ICustomComponent.  
    /// </summary>  
    public interface ICustomComponent:IComponent  
    {  
        string CustomDraw(); 
    }  
}  
```

**ComponentDecorator ComponentDecorator AbstractClass**
```c#
using System; 
namespace DecoratorPattern  
{  
    /// <summary>  
    /// Summary description for ComponentDecorator.  
    /// </summary>  
    public abstract class ComponentDecorator:ICustomComponent  
    {  
        private IComponent _component;  
        public ComponentDecorator(IComponent component)  
        {  
            this._component = component; 
        }  

        public string Draw()  
        {  
            if(this._component!=null)  
            {  
                return this._component.Draw(); 
            }  
            return "";  
        }  

        public abstract string CustomDraw(); 
    }  
}
```

`ComponentDecorator` 这个类的设计十分精彩：在创建时要求必须传入一个`IComponent`对象，实现`Draw`方法，同时又把`CustomDraw` 方法的具体实现交给了自己的子类，真正的做到了各司其职最小化的思想。在创建时传入的参数要求是`IComponent` 对象，因为自己只关心传入的参数是否实现了`Draw`方法，同时自己是从`ICustomComponent`继承而来，表明自己实现了`CustomDraw`方法，由于自己是`AbstractClass`，自己不实现`CustomDraw`方法,要求自己的子类实现`CustomDraw` 方法，给子类更大的灵活性。  

**SystemDraw SystemDraw Class**
```c#
using System;  
namespace DecoratorPattern  
{  
    /// <summary>  
    /// Summary description for SystemDraw.  
    /// </summary>  
    public class SystemDraw:IComponent  
    {  
        private string _drawMessage;  

        //you can add someting as you wish.  
        public SystemDraw(string drawMessage)  
        {  
            this._drawMessage = drawMessage;  
        }

        public string Draw()  
        {  
        return this._drawMessage;  
        }  
    }  
}  
```

**ConsoleDraw ConsoleDraw Class**
```c#
using System;  
namespace DecoratorPattern  
{  
    /// <summary>  
    /// Summary description for ConsoleDraw.  
    /// </summary>  
    public class ConsoleDraw:ComponentDecorator  
    {  
        public ConsoleDraw(IComponent component):base(component)
        {  
        }  
        
        public override string CustomDraw()  
        {  
            return("Custom console draw.");  
        }  
    }  
}  
```

**WindowDraw WindowDraw Class** 
```c#
using System;  
namespace DecoratorPattern  
{  
    /// <summary>  
    /// Summary description for WindowDraw.  
    /// </summary>  
    public class WindowDraw:ComponentDecorator  
    {  
        public WindowDraw(IComponent component):base(component)  
        {  
        }  
        public override string CustomDraw()  
        {  
            return("Custom window draw.");  
        }  
    }  
}  
```

**DecoratorTest Decorator Test Code**
```c#
private void DecoratorTest()  
{  
    IComponent sysComponent = new SystemDraw("System Draw");  
    WindowDraw winDraw = new WindowDraw(sysComponent);  
    ConsoleDraw conDraw = new ConsoleDraw(sysComponent);  
    Console.WriteLine("{0}", winDraw.Draw());  
    Console.WriteLine("{0}", winDraw.CustomDraw());  
    Console.WriteLine("{0}", conDraw.Draw());  
    Console.WriteLine("{0}", conDraw.CustomDraw());  
}
```

从`DecoratorPattern`的测试代码看，`WindowDraw`和`ConsoleDraw`可以有相同的`SystemDraw`操作,同时拥有自己不同的`CustromDraw`操作。`WindowDraw`和`ConsoleDraw`是从`ComponentDecorator`这个`AbstractClass`继承而来，保证了`WindowDraw`和`ConsoleDraw`.这两个类在创建时必须传入一个`IComponent`,调用这个`IComponent`的`Draw`方法，同时自己实现`CustomDraw`方法。

`SystemDraw`从`IComponent`继承而来，保证了自己提供出`Draw`方法供调用，因为用户并不关心`SystemDraw`这个类，而更加关心`Draw`方法的实现。  

下篇将写StrategyPattern这个模式，同时贴出下载代码。 