---
title: C#下界面设计初探
date: 2005-02-27 22:49:36 + 0800
category: [面向对象程序设计]
tags: [C#, Design, GUI, Programming]
image: 
  path: /assets/attachments/2005/02/28_090446_yvn34.gif
  show_top: false
---

对程序的设计分析可以面向对象，对界面的设计可以面向设计吗？.Net Web设计有一个.UI可以专门来设计 Asp.Net的界面。.Net界面的设计和操作分离可以很方便的实现。自学了.Net下的面向对象设计，用C#来实现.Net下的界面的设计和操作的分离。最近和同学合作，作了一个社区的管理程序，要求界面模仿Windows优化大师，要求界面简单易用功能分类清晰。下面是设计好的界面：  

### 整体样式
上部横条大类导航 左边是大类下的小类

![大类导航](/assets/attachments/2005/02/28_084033_74v01.gif)

![大类导航](/assets/attachments/2005/02/28_084224_07yd2.gif)

要求大类点一下，小类中的按钮就要改换一下，换到这个大类操作下的小类。在原来还没有学过面向对象界面设计的时候就把所有的小类都放在主Form的。当大类被点击了，置小类的 `Visible=true; Visible=false;如果这样写的话，在只有几个按钮的情况下很好处理，不过当按钮一多起来就很难控制了。

 **下面是根据面向对象的思想拆分各个窗体**

 每个左边的菜单都是一个Form，它被嵌入到了主Form里，各个Form 进行自己的操作。

![引用](/assets/attachments/2005/02/28_090147_nldr3.gif)

![引用](/assets/attachments/2005/02/28_090446_yvn34.gif)

### MainForm Load 函数
```c#
private void MainForm_Load(object sender, System.EventArgs e)  
{  
  transferForm += new TransferForm(this.InitialForm); 
  transferForm += new TransferForm(this.ShowFormMain); 

  baseInstance = new BaseInstance(); 
  InitialForm(baseInstance); 
  sideBase = new SideBase(transferForm); 
  InitialForm(sideBase); 
  sideRoutine = new SideRoutine(transferForm); 
  InitialForm(sideRoutine); 
  sideService = new SideService(transferForm); 
  InitialForm(sideService); 
  sidePeople = new SidePeople(transferForm); 
  InitialForm(sidePeople); 
  sideParty = new SideParty(transferForm); 
  InitialForm(sideParty); 
  sideComplex = new SideComplex(transferForm); 
  InitialForm(sideComplex); 
  sideProtect = new SideProtect(transferForm); 
  InitialForm(sideProtect); 

  lastSideForm=sideBase; 
  ShowFormSide(sideBase); 
  lastMainForm=baseInstance; 
  ShowFormMain(baseInstance); 
}  
```

### 初始化嵌套的窗体
```c#
public void InitialForm(Form showForm)  
{  
  showForm.Location = new Point(0,0); 
  showForm.TopLevel = false; 
  showForm.TopMost = false; 
  showForm.ControlBox = false; 
  showForm.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None; 
  showForm.StartPosition = System.Windows.Forms.FormStartPosition.Manual; 
}  
```

### 显示左边导航窗体
```c#
private void ShowFormSide(Form showForm)  
{  
  //showForm.Size = this.panelSide.ClientSize; 
  lastSideForm.Visible=false; 
  lastSideForm = showForm; 
  showForm.Parent=this.panelSide; 
  showForm.Visible =true; 
}  
```
### 显示右边功能窗体
```c#
public void ShowFormMain(Form showForm)  
{  
  //showForm.Size = this.panelMain.ClientSize; 
  lastMainForm.Visible=false; 
  lastMainForm = showForm; 
  showForm.Parent=this.panelMain; 
  showForm.Visible =true; 
}  
```

### 更换左边导航窗体
```c# 
private void btService_Click(object sender, System.EventArgs e)  
{  
  ShowFormSide(sideService); 
}  
```

最终实现了各个窗体管理自己的按钮，给别的窗体留出通讯接口（这里是 transferForm 那个指代给Side类窗体传入两个函数）各司其职，互相留好通信接口。功能和界面分离，管理方便。  

[**执行程序(需要.Net1.1运行时环境)**](/assets/attachments/2005/02/27_231728_b91fCommunity.rar)  
