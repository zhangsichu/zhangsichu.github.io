---
title: 由Server Too Busy Exception看到的问题
date: 2007-11-12 18:31:59 + 0080
category: [Web开发]
tags: [Web, Debugging, Performance, Software Development]
---

有一个Asp.Net页面在访问次数增多时，就会产生**Server Too Busy Exception**。整个站点就被拖累死了，访问哪个页面都是这个错误。奇怪的是访问量小不会出错，访问量一大就会频繁出现这个错误。在出错的时候，打开 **Task Manager** 看此时的Cpu 占用率和内存的使用情况都比较正常。Cpu没有一直100%被`w3wp`进程占用。只有**20%-30%**被占用。内存也剩余了很多。为什么会出这个问题。Google和Baidu都没有找到一个比较合适的答案。只是说要优化，不要频繁使用`Server.CreateObject`，不去设置IIS的访问个数限制。在这个Asp.Net页面中没有调用`Server.CreateObject`, IIS也没有设置访问个数。真是不解为什么会出这个错误。  

 **错误如下图：**  
![error](/assets/attachments/2007/11/12_183015_eb4herror.gif)  

又一次重新读了一遍代码。一开始想要解决数据库被频繁查询，在里面加了一个`HashTable`做为缓存。(这段程序是使用用户的IP从数据库中查询出用户所在的城市)  

```c#
//ipAddr 用户的Ip
long ipAddr = IpToLong(GetUserIp());    
if(ipAddr == 0) return null;

//IpTable static HashTable 缓存用户ip和城市的对应关系。  
if(IpTable[ipAddr] != null) return (string)IpTable[ipAddr]; 

string city;  
object temp = GetCityFromIp(ipAddr); 
city = (temp == null ? "" : temp.ToString()); 
IpTable.Add(ipAddr, city); 
return city;  
```
  

程序看起来没有什么问题。突然想起来，原来没有加`HashTable`做缓存，程序可以正常跑，有时候会出现数据库查询错。数据库忙，`connection.Open()`错。加了`HashTable`数据库没有错了。出现了**ServerTooBusy**错。应该是在用`HashTable`做缓存上错了。反射了`HashTable`。  
发现 `public static Hashtable IpTable = new Hashtable();` 会自动创建一个长度为 **11** 的`bucket` 数组。`bucket`是一个`struct`结构体。 

```c#
public Hashtable(int capacity, float loadFactor)  
{  
    if (capacity < 0)  
    {  
        throw new ArgumentOutOfRangeException("capacity", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));  
    }
    
    if ((loadFactor < 0.1f) || (loadFactor > 1f))  
    {  
        throw new ArgumentOutOfRangeException("loadFactor", Environment.GetResourceString("ArgumentOutOfRange_HashtableLoadFactor", new object[] { 0.1, 1.0 }));  
    }

    this.loadFactor = 0.72f * loadFactor; 
    double num = ((float) capacity) / this.loadFactor; 
    if (num > 2147483647.0)  
    {  
        throw new ArgumentException(Environment.GetResourceString("Arg_HTCapacityOverflow"));  
    }

    int num2 = (num > 11.0) ? HashHelpers.GetPrime((int) num) : 11; 
    this.buckets = new bucket[num2]; 
    this.loadsize = (int) (this.loadFactor * num2); 
    this.isWriterInProgress = false; 
}  
```

当调用`Add`时`Add`会判断当前`HashTable`中的数据的个数，如果还有空间就会直接加入，如果没有，会调用`rehash`。在`rehash`中会有一个比较消耗空间和时间的深拷贝，就是因为反复调用`putEnty`，做深拷贝，重新生成`HashTable`，占用了很多空间和时间。  

```c#
[ReliabilityContract(Consistency.WillNotCorruptState, Cer.MayFail)]  
private void rehash(int newsize)  
{  
    this.occupancy = 0; 
    Hashtable.bucket[] newBuckets = new Hashtable.bucket[newsize]; 
    for (int i = 0; i < this.buckets.Length; i++) 
    {  
        Hashtable.bucket bucket = this.buckets[i]; 
        if ((bucket.key != null) && (bucket.key != this.buckets))  
        {  
            this.putEntry(newBuckets, bucket.key, bucket.val, bucket.hash_coll & 0x7fffffff); 
        }  
    }

    Thread.BeginCriticalRegion(); 
    this.isWriterInProgress = true; 
    this.buckets = newBuckets; 
    this.loadsize = (int) (this.loadFactor * newsize); 
    this.UpdateVersion(); 
    this.isWriterInProgress = false; 
    Thread.EndCriticalRegion(); 
}  
```

问题很可能就是在`new HashTable`时没有指定`capacity`，当访问量一大，`HashTable`被多次`rehash`造成的。  

把原来的：`public static Hashtable IpTable = new Hashtable(); `    
改成了： `public static Hashtable IpTable = new Hashtable(30000);`  

**问题解决了。**  

**小结：**  
1. 估计，类似`HashTable`这种`Collection`类型的对象，内部都有这样的处理。反射了`NameValueCollection`。发现`NameValueCollection`内部自己保存了一个`HashTable`和一个`Array`。`ArrayList`的`Capacity`属性在被Set的时候也会做类似的处理。
2. 在进行`new`操作，产生对象的时候，最好预估算一下可能的大小，减少内部做`rehash`或`resize`的操作，从而提升性能。或者使用基于链表式的存储对象，在进行添加操作的时候，只操作节点引用，不进行类似`resize`的操作。`.Net 2.0`中的`SortedDictionary`是一个不错的选择，它内部使用树结构存储数据，实现了类似于红―黑树的数据结构。
