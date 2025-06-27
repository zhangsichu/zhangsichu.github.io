---
title: SQL Server DateAdd And DateDiff
date: 2007-01-11 11:43:26 + 0080
category: [SQL]
tags: [Database, SQL]
---

使用`DATEDIFF`和`DATEADD`函数来计算日期，和本来从当前日期转换到你需要的日期的考虑方法有点不同。必须从时间间隔这个方面来考虑。`DATEDIFF`函数计算两个日期之间的小时、天、周、月、年等时间间隔总数。 DATEADD函数计算一个日期通过给时间间隔加减来获得一个新的日期。  

### 一个月的第一天  
`SELECT DATEADD(mm, DATEDIFF(mm,0,getdate()), 0)` 
最核心的函数是 `getdate()`，下一个执行的函数 `DATEDIFF(mm,0,getdate())` 是计算当前日期和 `1900-01-01 00:00:00.000` 这个日期之间的月数。时期和时间变量和毫秒是从 `1900-01-01 00:00:00.000` 开始计算的。这就是为什么可以在 `DATEDIFF` 函数中指定第一个时间表达式为 `0`。下一个函数是 `DATEADD`，增加当前日期到 `1900-01-01` 的月数。通过增加预定义的日期 `1900-01-01` 和当前日期的月数，我们可以获得这个月的第一天。另外，计算出来的日期的时间部分将会是 `00:00:00.000`。  

### 本周的星期一
`SELECT DATEADD(wk, DATEDIFF(wk,0,getdate()), 0)` 

### 一年的第一天   
`SELECT DATEADD(yy, DATEDIFF(yy,0,getdate()), 0)`   

### 季度的第一天   
`SELECT DATEADD(qq, DATEDIFF(qq,0,getdate()), 0)`   

### 半夜的时间点  
`SELECT DATEADD(dd, DATEDIFF(dd,0,getdate()), 0)`  

### 上个月的最后一天
通过从一个月的最后一天这个例子上减去3毫秒来获得。在Sql Server 中时间是精确到 3毫秒。这是为什么需要减去3毫秒来获得需要的日期和时间。
`SELECT dateadd(ms,-3,DATEADD(mm, DATEDIFF(mm,0,getdate()), 0))` 计算出来的日期的时间部分包含了一个 Sql Server 可以记录的一天的最后时刻`23:59:59:997` 的时间。

### 去年的最后一天   
接上面的例子，需要在今年的第一天上减去3毫秒。   
`SELECT dateadd(ms,-3,DATEADD(yy, DATEDIFF(yy,0,getdate()), 0))`

### 本月的最后一天    
`SELECT dateadd(ms,-3,DATEADD(mm, DATEDIFF(m,0,getdate())+1, 0))`   

### 本年的最后一天  
`SELECT dateadd(ms,-3,DATEADD(yy, DATEDIFF(yy,0,getdate())+1, 0))`

### 本月的第一个星期一   
`select DATEADD(wk, DATEDIFF(wk,0, dateadd(dd,6-datepart(day,getdate()),getdate())), 0)` 计算中用本月的第6天来替换当前日期使得计算可以获得这个月的第一个星期一

### 去掉时分秒
```sql
declare @ datetime   
set @ = getdate() --2003-7-1 10:00:00   
SELECT @,DATEADD(day, DATEDIFF(day,0,@), 0)  
```

### 显示星期几   
`select datename(weekday,getdate())`   

### 如何取得某个月的天数
```sql
declare @m int   
set @m=2 --月份   
select datediff(day,2003-+cast(@m as varchar)+-15 ,2003-+cast(@m+1 as varchar)+-15)   
```

### 取得本月天数  
```sql
select datediff(day,cast(month(GetDate()) as varchar)+-+cast(month(GetDate()) as varchar)+-15 ,cast(month(GetDate()) as varchar)+-+cast(month(GetDate())+1 as varchar)+-15)
SELECT Day(dateadd(ms,-3,DATEADD(mm, DATEDIFF(m,0,getdate())+1, 0)))
```   

### 判断是否闰年  
```sql
SELECT case day(dateadd(mm, 2, dateadd(ms,-3,DATEADD(yy, DATEDIFF(yy,0,getdate()), 0)))) when 28 then '平年' else '闰年' end
select case datediff(day,datename(year,getdate())+-02-01,dateadd(mm,1,datename(year,getdate())+-02-01)) when 28 then '平年' else '闰年' end
```

### 一个季度多少天
```sql
declare @m tinyint,@time smalldatetime   
select @m=month(getdate())   
select @m=case when @m between 1 and 3 then 1   
when @m between 4 and 6 then 4   
when @m between 7 and 9 then 7   
else 10 end   
select @time=datename(year,getdate())+-+convert(varchar(10),@m)+-01   
select datediff(day,@time,dateadd(mm,3,@time)) 
```