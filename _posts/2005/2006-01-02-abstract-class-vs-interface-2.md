---
title: Abstract Class VS Interface[二]
date: 2006-01-02 15:42:45 + 0080
category: [面向对象程序设计]
tags: [C#, Design Pattern, Software Development]
---

`StrategyPattern`，这个实例想做一个策略者：把已经声明过的方法操作，在运行时进行调换。猛地一听好像有些奇怪，类中的某个方法已经声明过了，怎么能在运行时,替换它的实际的处理过程呢,只留了个方法名而作别的事情。`StrategyPattern`就是实现了这样的操作。  

**IStrategyDraw IStrategyDraw Interface**
```c#
using System; 
namespace StrategyPattern  
{  
    /// <summary>  
    /// Summary description for IStrategyDraw.  
    /// </summary>  
    public interface IStrategyDraw  
    {  
        //here just define a general draw function.  
        string StragegyDraw(); 
    }  
}  
```

**GeneralDraw GeneralDraw Class**
```c#
using System; 
namespace StrategyPattern  
{  
    /// <summary>  
    /// Summary description for GeneralDraw.  
    /// </summary>  
    public class GeneralDraw  
    {  
        private IStrategyDraw _strategyDraw;  

        public GeneralDraw()  
        {  
        }  

        public IStrategyDraw StrategyDraw  
        {  
            get  
            {  
                return this._strategyDraw;  
            }  
            set  
            {  
                this._strategyDraw = value; 
            }  
        }  

        public string StragegyDraw()  
        {  
            if (this._strategyDraw != null)  
            {  
                return this._strategyDraw.StragegyDraw(); 
            }  
            else  
            {  
                return "";  
            }
        }  

        public string SelfDraw()  
        {  
            return "Self Draw";  
        }
    }  
}
```

**ConsoleStrategy ConsoleStrategy Class**
```c#
using System; 
namespace StrategyPattern  
{  
    /// <summary>  
    /// Summary description for ConsoleStrategy.  
    /// </summary>  
    public class ConsoleStrategy : IStrategyDraw  
    {  
        public ConsoleStrategy()  
        {  
        }  

        public string StragegyDraw()  
        {  
        return "Console Draw";  
        }
    }  
}  
```

**WindowStategy WindowStategy Class**

```c#
using System; 
namespace StrategyPattern  
{  
    /// <summary>  
    /// Summary description for WindowStategy.  
    /// </summary>  
    public class WindowStategy:IStrategyDraw  
    {  
        public WindowStategy()  
        {
        }

        public string StragegyDraw()  
        {
            return "Window Draw";  
        }
    }  
}  
```

**StrategyDraw Test Code**
```c#
private void StrategyDraw()  
{  
    IStrategyDraw conStrategy = new ConsoleStrategy(); 
    IStrategyDraw winStrategy = new WindowStategy(); 
    GeneralDraw genDraw = new GeneralDraw(); 
    genDraw.StrategyDraw = conStrategy; 

    Console.WriteLine("{0}",genDraw.StragegyDraw());  
    Console.WriteLine("{0}",genDraw.SelfDraw());  

    genDraw.StrategyDraw = winStrategy; 
    Console.WriteLine("{0}",genDraw.StragegyDraw());  
    Console.WriteLine("{0}",genDraw.SelfDraw());  
}
```

`GeneralDraw`在运行时，根据自己内部的的`IStrategyDraw`确定`Draw`方法的实际操作，而外表上看`GeneralDraw`只给外界公开说自己有一个`Draw`方法。

在上面的两个设计模式中，`DecoratorPattern` 中的 `ComponentDecorator` 这个 `AbstractClass` 体现了`Class` 一级的抽象，`AbstractClass` 提供给了子类共有的属性和方法。在 `DecoratorPattern` 和`StrategyPattern` 中多出用到 `Interface`，体现了 `Interface` 是方法一级的抽象。  

[**源程序(Windows 2003 Enterprise + VS 2003 Enterprise 下编译通过 )**](/assets/attachments/2006/01/02_170640_85waDesignPattern.rar)
