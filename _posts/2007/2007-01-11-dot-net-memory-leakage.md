---
title: .Net内存泄漏问题
date: 2007-01-11 15:11:04 + 0080
category: [.Net/Java]
tags: [C#, Multithreading, Software Development, Performance]
---

### 堆栈内存泄漏  
堆栈内存泄漏有两种可能：  
1. 进行一种非常消耗堆栈资源的的调用操作，并借这种调用操作不返回，不释放资源。使得.Net无法释放这些关联的堆栈资源。  
2. 在多线程情况下，虽然线程的Thread引用回收了，但是不手动回收线程，在线程不会中止或者不会返回时，线程所占用的资源也就不会被回收。  

### 非托管堆内存泄漏  
1. 主要原因是使用了COM 这样的非托管组件，由于.Net的GC不能识别这些COM组件，那么GC就无法对它进行回收。所以这些组件需要自己写代码回收。  
2. 对象的析构，没有被调用。  
3. 托管对象不写不必要的析构方法。如果托管对象操作了非托管资源才有可能需要写析构方法，对非托管资源进行回收，如果完全是托管资源的使用，完全没有必要写析构方法。如果写了还要更多一次的GC调用，升高了一次Generation。增大了回收代价。  
