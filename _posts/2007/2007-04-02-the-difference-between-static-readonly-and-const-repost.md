---
title: static readonly 和 const 的区别和联系[转载]
date: 2007-04-02 17:13:42 + 0080
category: [.Net/Java]
tags: [C#, Design]
---

以下的 `static` `readonly` 是否可以替换为 `const`?  
1. `static readonly MyClass myins = new MyClass();`  
2. `static readonly MyClass myins = null;`
3. `static readonly A = B * 20;`  `static readonly B = 10;`
4. `static readonly int [] constIntArray = new int[] {1, 2, 3};`  
5. 
```c#
void SomeFunction()  
{  
 const int a = 10;  
}  
```

`const` 和 `static` `readonly` 很像：通过类名而不是对象名进行访问，在程序中只读等等。在多数情况下可以混用。二者本质的区别在于:

1. const的值是在编译期间确定的，因此只能在声明时通过常量表达式指定其值。  
2. static readonly是在运行时计算出其值的， 只有两种途径为其赋值，在声明该变量的时候或在默认的静态构造函数里面为其赋值。实际上这两种方法最后生成的IL代码是相同的（都是在静态构造函数中赋值）。  

明白了这个本质区别，我们就不难看出下面的语句中 `static` `readonly` 和 `const` 能否互换了：  
1. 不可以换成`const`。`new`操作符是需要执行构造函数的，所以无法在编译期间确定  
2. 可以换成`const`。我们也看到，`Reference`类型的常量（除了`String`）只能是`Null`。  
3. 可以换成`const`。我们可以在编译期间很明确的说，A 等于 200。  
4. 不可以换成`const`。道理和1是一样的，虽然看起来`1,2,3`的数组的确就是一个常量。  
5. 不可以换成`readonly`，`readonl`y只能用来修饰类的`field`，不能修饰局部变量，也不能修饰`property`等其他类成员。  

因此，对于那些本质上应该是常量，但是却无法使用`const`来声明的地方，可以使用`static` `readonly`。例如 C# 规范中给出的例子：
```c#
public class Color  
{  
    public static readonly Color Black = new Color(0, 0, 0);  
    public static readonly Color White = new Color(255, 255, 255);  
    public static readonly Color Red = new Color(255, 0, 0);  
    public static readonly Color Green = new Color(0, 255, 0);  
    public static readonly Color Blue = new Color(0, 0, 255); 

    private byte red, green, blue;  
    public Color(byte r, byte g, byte b)  
    {  
        red = r;  
        green = g;  
        blue = b;  
    }  
}  
```

`static` `readonly` 需要注意的一个问题是，对于一个 `static` `readonly`的 **Reference** 类型，只是被限定不能进行赋值（写）操作而已。而对其成员的读写仍然是不受限制的。  

```c#
public static readonly MyClass myins = new MyClass();  

myins.SomeProperty = 10; //正常  
myins = new MyClass(); //出错，该对象是只读的  

//但是，如果上例中的MyClass不是一个class而是一个struct，那么后面的两个语句就都会出错。  

//static readonly的field可以被反射修改。  

using System;  
using System.Collections.Generic;  
using System.Text;  
using System.Reflection;  
namespace ConsoleApplication1  
{  
    class Program  
    {  

        static void Main(string[] args)  
        {  
            Console.WriteLine(A.field1);  
            FieldInfo fi= typeof(A).GetField("field1");  
            
            if (fi != null)  
            {  
                fi.SetValue(null, "456");  
            }

            Console.WriteLine(A.field1);  
            Console.ReadKey();  
        }
            
        class A  
        {  
            public static readonly string field1 = "123";  
        }  
    }  
}
```
**输出：**  

`123`  
`456 `

