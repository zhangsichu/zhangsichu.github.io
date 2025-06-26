---
title: 用信号量控制线程
date: 2005-02-11 12:12:35 + 0080
category: [C++/C]
tags: [C++/C, Design, Multithreading, 多线程]
---

###### 开发环境：VS7，Windows XP  
---

很好的控制线程，让线程互斥，互相协调工作，共享数据，这个问题有很多种解决办法，不过我个人觉得使用信号量控制线程特别方便。会想到用多线程控制程序，是由于上学期我们要做一个控制电机转速的课程设计，开始编写的程序都是一个线程控制的。后来课程设计结束了，一次在看多线程的演示程序的时候突然想到，原来的那个电机控制程序完全可以写成多线程，可是由于课程设计结束了，没有硬件供你调试，就自己写了个多线程的练习程序。  

### 控制信号量主要的函数
```cpp
WaitForSingleObject();//等待信号量有效
CreatSemaphore();//申请信号量
OpenSemaphore();//打开信号量
ReleaseSemaphore();//释放信号量
```

### 示例代码
```cpp
HANDLE ptrSpdUpDown;  
HANDLE ptrUpDownDraw;  
HANDLE ptrDrawSpd; //申请指向信号量的句柄  
ptrSpdUpDown = ::CreateSemaphore(NULL, 0, 1, NULL);
ptrUpDownDraw = ::CreateSemaphore(NULL, 0, 1, NULL);
ptrDrawSpd = ::CreateSemaphore(NULL, 1, 1, NULL); //实例化三个信号量

bOnOff=true; //线程状态控制量 开启三个线程
m_tWriteSpeed=AfxBeginThread(WriteSpeed, &m_sWriteSpeed, THREAD_PRIORITY_NORMAL, 0, CREATE_SUSPENDED);  

m_tWriteSpeed->ResumeThread();
m_tWriteUpDown=AfxBeginThread(WriteUpDown, &m_sWriteUpDown, THREAD_PRIORITY_NORMAL, 0, CREATE_SUSPENDED);  

m_tWriteUpDown->ResumeThread();
m_tDrawWindow=AfxBeginThread(DrawWindow, &m_sDrawWindow, THREAD_PRIORITY_NORMAL, 0, CREATE_SUSPENDED);  
m_tDrawWindow->ResumeThread();

//三个线程函数  
UINT WriteSpeed(LPVOID p)  
{  
  int iNo=1;  
  CString sTr;  
  CString sMe;  
  CEdit *ptr=(CEdit *)p;
  while(bOnOff)  
    {  
      WaitForSingleObject(ptrDrawSpd,INFINITE);
      ptr->SetWindowText("线程WriteSpeed正在运行"+sTr+"---Speed:"+sMe+"已经接到信号");
      ::Sleep(1000);
      srand((int)time(0)); //种种子数  
      iSpeed=iUp+iDown+rand();
      ReleaseSemaphore(ptrSpdUpDown,1,NULL);
      sTr.Format("%d",iNo);
      sMe.Format("%d",iSpeed);
      ptr->SetWindowText("线程WriteSpeed正在运行"+sTr+"---Speed:"+sMe);
      iNo++;  
    }  
  return 0;  
} 

UINT WriteUpDown(LPVOID p)  
{  
  int iNo=1;
  CString sTr;  
  CString sMe;  
  CEdit *ptr=(CEdit *)p;
  while(bOnOff)  
  {  
    WaitForSingleObject(ptrSpdUpDown,INFINITE);
    ptr->SetWindowText("线程WriteUpDown正在运行"+sTr+"---Up:"+sMe+"已经接到信号"); 
    ::Sleep(1000);
    srand((int)time(0)); //种种子数  
    iUp=iSpeed-rand();
    iDown=iSpeed+rand();
    ReleaseSemaphore(ptrUpDownDraw,1,NULL);
    sTr.Format("%d",iNo);
    sMe.Format("%d",iUp);
    ptr->SetWindowText("线程WriteUpDown正在运行"+sTr+"---Up:"+sMe);
    iNo++;  
  }  
  return 0;  
}

UINT DrawWindow(LPVOID p)  
{  
  int iNo=1;
  CString sTr;  
  CEdit *ptr=(CEdit *)p;
  while(bOnOff)  
    {  
      WaitForSingleObject(ptrUpDownDraw,INFINITE);
      ptr->SetWindowText("线程DrawWindow正在运行"+sTr+"已经接到信号");
      ::Sleep(1000);
      sTr.Format("%d",iNo);
      ptr->SetWindowText("线程DrawWindow正在运行"+sTr);
      iNo++;  
      ReleaseSemaphore(ptrDrawSpd,1,NULL);
    }  
  return 0;  
}
```

**上面的方法是先申请信号量的句柄然后再实例化信号量**

下面这种方法是直接申请信号量，两种方法基本相同：
```cpp
CSemaphore ptrSpdUpDown(0, 1);
CSemaphore ptrUpDownDraw(0, 1);
CSemaphore ptrDrawSpd(1, 1); //#include <atlsync.h>注意在stdafx.h手动包含这个文件
```
在各个线程函数中不用 `WaitForSingleObject` 了要使用 `Lock() UnLock();`

下面是使用CSemaphore后在各个线程函数中使用 `Lock()UnLock()` 替换掉`WaitForSingleObject` 的结果  

```cpp
UINT WriteSpeed(LPVOID p)  
{  
  int iNo=1;
  CString sTr;  
  CString sMe;  
  CEdit *ptr=(CEdit *)p;
  while(bOnOff)  
  {  
    ptrDrawSpd.Lock();
    ptr->SetWindowText("线程WriteSpeed正在运行"+sTr+"---Speed:"+sMe+"已经接到信号");
    ::Sleep(1000);
    srand((int)time(0)); //种种子数  
    iSpeed=iUp+iDown+rand();
    ReleaseSemaphore(ptrSpdUpDown,1,NULL);
    ptrSpdUpDown.Unlock();
    sTr.Format("%d",iNo);
    sMe.Format("%d",iSpeed);
    ptr->SetWindowText("线程WriteSpeed正在运行"+sTr+"---Speed:"+sMe);
    iNo++;  
  }  
  return 0;  
}  

UINT WriteUpDown(LPVOID p)  
{  
  int iNo=1;
  CString sTr;  
  CString sMe;  
  CEdit *ptr=(CEdit *)p;
  while(bOnOff)  
  {  
    ptrSpdUpDown.Lock();
    ptr->SetWindowText("线程WriteUpDown正在运行"+sTr+"---Up:"+sMe+"已经接到信号");
    ::Sleep(1000);
    srand((int)time(0)); //种种子数  
    iUp=iSpeed-rand();
    iDown=iSpeed+rand();
    ReleaseSemaphore(ptrUpDownDraw,1,NULL);
    ptrUpDownDraw.Unlock();
    sTr.Format("%d",iNo);
    sMe.Format("%d",iUp);
    ptr->SetWindowText("线程WriteUpDown正在运行"+sTr+"---Up:"+sMe);
    iNo++;  
  }  
  return 0;  
}  

UINT DrawWindow(LPVOID p)  
{  
  int iNo=1;
  CString sTr;  
  CEdit *ptr=(CEdit *)p;
  while(bOnOff)  
  {  
    ptrUpDownDraw.Lock();
    ptr->SetWindowText("线程DrawWindow正在运行"+sTr+"已经接到信号");
    ::Sleep(1000);
    sTr.Format("%d",iNo);
    ptr->SetWindowText("线程DrawWindow正在运行"+sTr);
    iNo++;  
    ReleaseSemaphore(ptrDrawSpd,1,NULL);
    ptrDrawSpd.Unlock();
  }  
  return 0;  
}  
```

**推荐使用第一种方法，第一种方法只声明了句柄，当信号量实例化的时候句柄才指向三个信号量，所以更加支持多态。**

程序初始化  
![线程](/assets/attachments/2005/02/11_001136_63u91.gif)

程序运行中  
![线程](/assets/attachments/2005/02/11_001209_qnfu2.gif)

