---
title: C# 2.0 新特性 学习心得
date: 2006-07-02 11:42:59 + 0080
category: [.Net/Java]
tags: [C#, Software Development]
---

1) 类型 空属类型 静态类型 都是变异器层面上的处理，并非CLR的上的改动。都是语言层面的处理，在编译器上处理后，不会在CLR上作特殊的处理。  

2) `Partial` 只支持 `Class` `Interface` `Struct` 且在同一命名空间 同时编译。  

3) `Prtical Class` 的 `Attribute` 是累加的。  

4) 空属类型 是一个泛型类型 `System.Nullable<int> int?` 主要调用`HasValue()` `HasValue` `Function` 是空属类型很实用的`Function`。  

5) `Static class` 默认继承 `System.Object`。  

6) 局部类型是一个纯语言层的编译处理，不影响任何执行机制―实事上C#编译器在编译的时候仍会将各个部分的局属类型合并成一个完整的类。  

7) 空属类型允许一个值类型具有“空值”意义，从而方便很多场合的运算，如数据库的空字段。空属类型实际上是一个泛型类型的 `System.Nullable<T>`。

8) 静态类是一个用于包含静态成员的类型，它既不能实例化，也不能被继承。它相当一个 `Sealed Abstract` 类。  

9) C#的泛型能力由CLR在运行时支持，区别于C++的编译时模板机制，和Java的编译时 “擦拭法”。这使得泛型能力可以在各个支持CLR的语言之间进行无缝的互操作。  

10) C#的泛型代码在被编译为IL代码和原数据时，采用特殊的占位符来表示泛型类型，并用专用的IL指令支持泛型操作。而真正的泛型实例化工作以“On-Demand”的方式，发生在JIT编译时。  

11) C++的模板机制，相同的泛型不同的需求类型，编译时生成多套代码对应不同的需求类型，而C#在这种情况下只有一套代码（2.0 IL指令支持 实现了这一点）。(引用类型)  

12) C#的泛型类型携带有丰富的元数据，因此C#的泛型类型可以应用于强大的反射技术。  

13) 泛型方法例子。   
```c#
public class Finder
{
    public static int Find<T>(T[] items, T item)
    {
        for (int i = 0; i < items.Length; i++)
        {
            if (items[i].Equals(item))
        {
            return i;
        }
        }
        return -1;
    }

    public static int Test()
    {
        return Find<string>(new string[] { "1", "2", "3", "4", "5" }, "5");
    }
}
```

14) 泛型参数约束符 `where`  
```c#
public bool Good<T>(T item) where T : IComparable  
{  
    return true;  
}   
```

15) 属性访问器上的约束符  
```c#
Private string name;
Public string Name {  
    Get { return this.Name }  
    Internal set { this.name = value }  
}
```
`get` 与 `set` 中有一个必须使用属性上的属性，属性访问器 (get 或 set ) 上应用的访问修饰符必须“小于”属性上应用的访问修饰符；“小于”的意识是：“更加严格”，例如 `Private` 小于 `Public`。

16) `#pragma warning` 设置  
`#pragma warning disable 612. #pragma warning disable` 可以禁止任何编译器的警告信息。  
`#pragma waring restore 612. #pragma warning restor` 可以恢复被disable掉的任何编译器警告的信息。  
可以 `在disable` 和 `restore` 后跟上具体的警告代号，从而来禁止或恢复。  

17) 使用 `yield retun/yield break`   
在自己实现的集合类型上的迭代器控制自己想要得输出 `yield return` `yield break` 是一个很好的选择。

```c#
public class MyCollection : IEnumerable<string>  
{  
    string[] m_Cities = { "New York", "Paris", "London" }; 

    //string IEnumerabe<string>  
    IEnumerator<string> IEnumerable<string>.GetEnumerator()  
    {  
        for (int i = 0; i < m_Cities.Length; i++) 
        yield return m_Cities[i];  
    }  
    //object IEnumerabe  
    IEnumerator IEnumerable.GetEnumerator()  
    {  
        for (int i = 0; i < m_Cities.Length; i++) 
        yield return m_Cities[i];  
    }  
    public IEnumerable<string> Reverse  
    {  
        get  
        {  
            for (int i = m_Cities.Length - 1; i >= 0; i--) 
            yield return m_Cities[i];  
        }  
    }  
}  

private void MainForm_Load(object sender, EventArgs e)  
{  
    MyCollection collection = new MyCollection(); 
    foreach (string city in collection)  
    {  
        MessageBox.Show(city); 
    }  
    foreach (string city in collection.Reverse)  
    {  
        MessageBox.Show(city); 
    }  
}  
```