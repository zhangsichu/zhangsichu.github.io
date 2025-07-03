---
title: 从求解一元二次方程的根看面向对象程序设计
date: 2005-02-16 22:46:57 + 0080
category: [面向对象程序设计]
tags: [C++/C, C#, Debugging, Design, Multithreading, 多线程, Programming]
---

面向对象可利用设计(OOD)的第一块基石，就是"开-闭原则（Open-Closed Principle,简称OCP）。OCP原则认为：一个软件应该对扩展开放，对修改关闭。 这是由大师Bertrand Meyer提出，英文原文是: Software entities should be open for extension,but closed for modification. 那么怎么在程序设计中做到遵循OCP原则，进行面向对象程序设计呢？在这个问题上很多大师都说是 经验+技巧 才可以达到用OCP原则来指导面向对象程序设计。本人学了一段时间，可是还没有完全领悟OCP原则，下面以求解一元二次方程的根为例，通过5次改进达到使用OCP原则指导面向对象程序设计，代码在WinXp Sp2+C# 下编译通过。  

### 第一次：完全面向过程的写法可以说就是一个C程序用C#重新包装了一下

```c#
using System;
namespace equation1  
{  
  /// <summary>  
  /// Class1 的摘要说明。  
  /// </summary>  
  class Class1  
  { 
    /// <summary>  
    /// 应用程序的主入口点。  
    /// </summary>  
    [STAThread]  
    static void Main(string[] args)  
    {  
      string A;  
      string B;  
      string C;  
      int a;  
      int b;  
      int c;  
      bool bPlural;  
      string X1;  
      string X2;  

      System.Console.Write("Please input the modulus A = "); 
      A=System.Console.ReadLine(); 
      System.Console.Write("Please input the modulus B = "); 
      B=System.Console.ReadLine(); 
      System.Console.Write("Please input the modulus C = "); 
      C=System.Console.ReadLine(); 

      try  
      {  
        a=int.Parse(A); 
        b=int.Parse(B); 
        c=int.Parse(C); 
      }  
      catch  
      {  
        System.Console.WriteLine("Input error!!!"); 
        return;  
      }  

      double dt;  
      dt=b*b-4*a*c; 
      bPlural=dt>=0?false:true; 
      dt=System.Math.Abs(dt); 
      dt=System.Math.Sqrt(dt); 
      double x1;  
      double x2;  

      if(bPlural)  
      {  
        x1=dt/2/a; 
        x2=(0-b)/2/a; 
        X1=x2.ToString()+"+"+x1.ToString()+"i"; 
        x1=0-x1; 
        X2=x2.ToString()+x1.ToString()+"i"; 
      }  
      else  
      {  
        x1=(dt-b)/2/a; 
        x2=(0-b-dt)/2/a; 
        X1=x1.ToString(); 
        X2=x2.ToString(); 
      } 

      System.Console.WriteLine("X1 = {0}",X1); 
      System.Console.WriteLine("X2 = {0}",X2); 
    } 
  }  
} 
```

### 第二次：抽象了一个方程类 不过数据和操作完全耦合在一起

```c#
using System;  
namespace equation2  
{  
  /********************************************************************/  
  //eqtion抽象出的方程类 //  
  //int a int b int c 分别为方程的系数 //  
  //string X1 string X2 为方程的两个根 //  
  //public void operation() 为方程求解的操作 //  
  /********************************************************************/  
  public class eqtion  
  {  
    private int a;  
    private int b;  
    private int c;  
    public string X1;  
    public string X2;  

    public eqtion(int a,int b,int c)  
    {  
      this.a=a; 
      this.b=b; 
      this.c=c; 
      //  
      // TODO: 在此处添加构造函数逻辑  
      //  
    }  
    
    public void operation()  
    {  
      double dt;  
      dt=b*b-4*a*c; 
      bool bPlural=dt>=0?false:true; 
      dt=System.Math.Abs(dt); 
      dt=System.Math.Sqrt(dt); 
      double x1;  
      double x2;  
      if(bPlural)  
      {  
        x1=dt/2/a; 
        x2=(0-b)/2/a; 
        X1=x2.ToString()+"+"+x1.ToString()+"i"; 
        x1=0-x1; 
        X2=x2.ToString()+x1.ToString()+"i"; 
      }  
      else  
      {  
        x1=(dt-b)/2/a; 
        x2=(0-b-dt)/2/a; 
        X1=x1.ToString(); 
        X2=x2.ToString(); 
      }  
    }  
     ~eqtion()  
    {  
    }
  }  
}  
```
```c#
using System; 
namespace equation2
{  
  /// <summary>  
  /// Class1 的摘要说明。  
  /// </summary>  
  class Class1  
  {  
    /// <summary>  
    /// 应用程序的主入口点。  
    /// </summary>  
    [STAThread]  
    static void Main(string[] args)  
    {  
      string A;  
      string B;  
      string C;  
      int a;  
      int b;  
      int c;  
      System.Console.Write("Please input the modulus A = "); 
      A=System.Console.ReadLine(); 
      System.Console.Write("Please input the modulus B = "); 
      B=System.Console.ReadLine(); 
      System.Console.Write("Please input the modulus C = "); 
      C=System.Console.ReadLine(); 
      try  
      {  
        a=int.Parse(A); 
        b=int.Parse(B); 
        c=int.Parse(C); 
      }  
      catch  
      {  
        System.Console.WriteLine("Input error!!!"); 
        return;  
      }  
      eqtion Opeqtion =new eqtion(a,b,c); 
      Opeqtion.operation(); 
      System.Console.WriteLine("X1 = {0}",Opeqtion.X1); 
      System.Console.WriteLine("X2 = {0}",Opeqtion.X2); 
    }  
  }  
}  
```

### 第三次：抽象的方程类中数据和操作完全聚合在一起 
```c#
using System; 
namespace equation3  
{  
  /********************************************************************/  
  //eqtion抽象出的方程类 //  
  //string X1 string X2 为方程的两个根 //  
  //public eqtion() 既是类的构造函数又是方程求解的操作 //  
  /********************************************************************/  
  public class eqtion  
  {  
    public string X1;  
    public string X2;  

    public eqtion(int a,int b,int c)  
    {  
      double dt;  
      dt=b*b-4*a*c; 
      bool bPlural=dt>=0?false:true; 
      dt=System.Math.Abs(dt); 
      dt=System.Math.Sqrt(dt); 
      double x1;  
      double x2;  
      if(bPlural)  
      {  
        x1=dt/2/a; 
        x2=(0-b)/2/a; 
        X1=x2.ToString()+"+"+x1.ToString()+"i"; 
        x1=0-x1; 
        X2=x2.ToString()+x1.ToString()+"i"; 
      }  
      else  
      {  
        x1=(dt-b)/2/a; 
        x2=(0-b-dt)/2/a; 
        X1=x1.ToString(); 
        X2=x2.ToString(); 
      }
    }  
     
    ~eqtion()  
    {  
    }
  }  
}  
```

```c#
using System; 
namespace equation3  
{  
  /// <summary>  
  /// Class1 的摘要说明。  
  /// </summary>  
  class Class1  
  {  
    /// <summary>  
    /// 应用程序的主入口点。  
    /// </summary>  
    [STAThread]  
    static void Main(string[] args)  
    {  
      string A;  
      string B;  
      string C;  
      int a;  
      int b;  
      int c;

      System.Console.Write("Please input the modulus A = "); 
      A=System.Console.ReadLine(); 
      System.Console.Write("Please input the modulus B = "); 
      B=System.Console.ReadLine(); 
      System.Console.Write("Please input the modulus C = "); 
      C=System.Console.ReadLine(); 
      try  
      {  
        a=int.Parse(A); 
        b=int.Parse(B); 
        c=int.Parse(C); 
      }  
      catch  
      {  
        System.Console.WriteLine("Input error!!!"); 
        return;  
      }  
      eqtion Opeqtion =new eqtion(a,b,c); 
      System.Console.WriteLine("X1 = {0}",Opeqtion.X1); 
      System.Console.WriteLine("X2 = {0}",Opeqtion.X2); 
    }  
  }  
}  
```

### 第四次：抽象的方程类中只有操作了 数据通过参数传入传出
```c#
using System; 
namespace equation4  
{  
  /********************************************************************/  
  //eqtion抽象出的方程类 //  
  //string X1 string X2 为求得的方程的两个根用out方式输出 //  
  //public eqtion() 既是类的构造函数又是方程求解的操作 //  
  /********************************************************************/  
  public class eqtion  
  {  
    public eqtion(int a,int b,int c,out string X1,out string X2)  
    {  
      double dt;  
      dt=b*b-4*a*c; 
      bool bPlural=dt>=0?false:true; 
      dt=System.Math.Abs(dt); 
      dt=System.Math.Sqrt(dt); 
      double x1;  
      double x2;  
      if(bPlural)  
      {  
        x1=dt/2/a; 
        x2=(0-b)/2/a; 
        X1=x2.ToString()+"+"+x1.ToString()+"i"; 
        x1=0-x1; 
        X2=x2.ToString()+x1.ToString()+"i"; 
      }  
      else  
      {  
        x1=(dt-b)/2/a; 
        x2=(0-b-dt)/2/a; 
        X1=x1.ToString(); 
        X2=x2.ToString(); 
      }  
    }  
    ~eqtion()  
    {  
    }  
  }  
}  
```

```c#
using System; 
namespace equation4  
{  
  /// <summary>  
  /// Class1 的摘要说明。  
  /// </summary>  
  class Class1  
  {  
    /// <summary>  
    /// 应用程序的主入口点。  
    /// </summary>  
    [STAThread]  
    static void Main(string[] args)  
    {  
      string A;  
      string B;  
      string C;  
      int a;  
      int b;  
      int c;  
      System.Console.Write("Please input the modulus A = "); 
      A=System.Console.ReadLine(); 
      System.Console.Write("Please input the modulus B = "); 
      B=System.Console.ReadLine(); 
      System.Console.Write("Please input the modulus C = "); 
      C=System.Console.ReadLine(); 
      try  
      {  
        a=int.Parse(A); 
        b=int.Parse(B); 
        c=int.Parse(C); 
      }  
      catch  
      {  
        System.Console.WriteLine("Input error!!!"); 
        return;  
      }  
      string X1,X2;  
      eqtion Opeqtion =new eqtion(a,b,c,out X1,out X2); 
      System.Console.WriteLine("X1 = {0}",X1); 
      System.Console.WriteLine("X2 = {0}",X2); 
    }  
  }  
}  
```

### 第五次：抽象出两个类 一个专门存数据 一个是操作类 数据和操作完全分离
```c#
using System; 
namespace equation5  
{  
  /********************************************************************/  
  //eqtion抽象出的方程数据类 //  
  //int a int b int c 分别为方程的系数 //  
  //public int A public intB public int C 为方程的系数和操作类的接口 //  
  /********************************************************************/  
  public class edata  
  {  
    private int a;  
    private int b;  
    private int c;

    public edata(int a,int b,int c)  
    {  
      this.a=a; 
      this.b=b; 
      this.c=c; 
    }  
  
    public int A  
    {  
      get  
      {  
        return a;  
      }  
    }  
      
    public int B  
    {  
      get  
      {  
        return b;  
      }  
    }  
    
    public int C  
    {  
      get  
      {  
        return c;  
      }  
    }  
  }  
}  
```

```c#
using System; 
namespace equation5  
{  
  /********************************************************************/  
  //eqtion抽象出的操作方程类 //  
  //string X1 string X2 为求得的方程的两个根用out方式输出 //  
  //public eqtion() 既是类的构造函数又是方程求解的操作 //  
  /********************************************************************/  
  public class eqtion  
  {  
    public eqtion(edata inData,out string X1,out string X2)  
    {  
      double dt;  
      dt=inData.B*inData.B-4*inData.A*inData.C; 
      bool bPlural=dt>=0?false:true; 
      dt=System.Math.Abs(dt); 
      dt=System.Math.Sqrt(dt); 
      double x1;  
      double x2;  

      if(bPlural)  
      {  
        x1=dt/2/inData.A; 
        x2=(0-inData.B)/2/inData.A; 
        X1=x2.ToString()+"+"+x1.ToString()+"i"; 
        x1=0-x1; 
        X2=x2.ToString()+x1.ToString()+"i"; 
      }  
      else  
      {  
        x1=(dt-inData.B)/2/inData.A; 
        x2=(0-inData.B-dt)/2/inData.A; 
        X1=x1.ToString(); 
        X2=x2.ToString(); 
      }  
    }  
  }  
}  
```

```c#
using System; 
namespace equation5  
{  
  /// <summary>  
  /// Class1 的摘要说明。  
  /// </summary>  
  class Class1  
  {  
    /// <summary>  
    /// 应用程序的主入口点。  
    /// </summary>  
    [STAThread]  
    static void Main(string[] args)  
    {  
      string A;  
      string B;  
      string C;  
      int a;  
      int b;  
      int c;  
      System.Console.Write("Please input the modulus A = "); 
      A=System.Console.ReadLine(); 
      System.Console.Write("Please input the modulus B = "); 
      B=System.Console.ReadLine(); 
      System.Console.Write("Please input the modulus C = "); 
      C=System.Console.ReadLine(); 

      try  
      {  
        a=int.Parse(A); 
        b=int.Parse(B); 
        c=int.Parse(C); 
      }  
      catch  
      {  
        System.Console.WriteLine("Input error!!!"); 
        return;  
      }  

      string X1,X2;  
      edata Opedata = new edata(a,b,c); 
      eqtion Opeqtion =new eqtion(Opedata,out X1,out X2); 
      System.Console.WriteLine("X1 = {0}",X1); 
      System.Console.WriteLine("X2 = {0}",X2); 
    }  
  }  
}  
```

通过5次修改完成了数据和操作的分离。根据OCP原则，要对方程再作什么操作，就再抽象出一个操作类来。而方程的数据类不变，它是不可以修改的。对要添加的新功能是开放的，对内部结构设计的修改是关闭的。 

[**源代码(WinXp Sp2+Visual Studio 2003 下编译通过)**](/assets/attachments/2005/02/16_170740_2yq5equation.rar)

