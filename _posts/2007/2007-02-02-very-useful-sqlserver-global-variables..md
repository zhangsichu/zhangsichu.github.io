---
title: 很有用的SQLServer全局变量
date: 2007-02-02 12:10:45 + 0080
category: [SQL]
tags: [SQL, Database, Debugging]
---

本文原文从公司的GCDN来，经过自己整理。

```sql
SELECT APP_NAME() AS APPName --当前会话的应用程序名称。  
SELECT @@ERROR --返回最后执行的 Transact-SQL 语句的错误代码(integer)。  
SELECT @@IDENTITY --返回最后插入的标识值。  
SELECT SCOPE_IDENTITY() --返回最后插入的标识值，不会被Trigger影响。  
SELECT USER_NAME() --返回用户数据库用户名。  
SELECT @@CONNECTIONS --返回自上次SQL启动以来连接或试图连接的次数。  
SELECT GETDATE() --当前时间。  
SELECT @@CPU_BUSY/100 --返回自上次启动SQL 以来 CPU 的工作时间(单位为毫秒)。  
USE tempdb SELECT @@DBTS AS Timestamp --为当前数据库返回当前 timestamp 数据类型的值。这一 timestamp 值保证在数据库中是唯一的。  
SELECT @@IDLE AS Temp --返回SQL自上次启动后闲置的时间(单位为毫秒)。  
SELECT @@IO_BUSY AS W --返回SQL自上次启动后用于执行输入和输出操作的时间(单位为毫秒)。  
SELECT @@LANGID AS W --返回当前所使用语言的本地语言标识符(ID)。  
SELECT @@LANGUAGE AS W --返回当前使用的语言名。  
SELECT @@LOCK_TIMEOUT AS W --当前会话的当前锁超时设置(单位为毫秒)。  
SELECT @@MAX_CONNECTIONS AS W --返回SQL上允许的同时用户连接的最大数。返回的数不必为当前配置的数值。  
EXEC sp_configure --显示当前服务器的全局配置设置。  
SELECT @@MAX_PRECISION AS W --返回 decimal 和 numeric 数据类型所用的精度级别，即该服务器中当前设置的精度。默认最大精度38。  
SELECT @@OPTIONS AS W --返回当前 SET 选项的信息。  
SELECT @@PACK_RECEIVED AS W --返回SQL自启动后从网络上读取的输入数据包数目。  
SELECT @@PACK_SENT AS W --返回SQ自上次启动后写到网络上的输出数据包数目。  
SELECT @@PACKET_ERRORS AS W --返回自SQL启动后，在SQL连接上发生的网络数据包错误数。  
SELECT @@SERVERNAME AS W --返回运行SQL服务器名称。  
SELECT @@SERVICENAME AS W --返回SQL正在其下运行的注册表键名。  
SELECT @@TIMETICKS AS W --返回SQL服务器一刻度的微秒数。  
SELECT @@TOTAL_ERRORS AS W --返回 SQL服务器自启动后，所遇到的磁盘读/写错误数。  
SELECT @@TOTAL_READ AS W --返回 SQL服务器自启动后读取磁盘的次数。  
SELECT @@TOTAL_WRITE AS W --返回SQL服务器自启动后写入磁盘的次数。  
SELECT @@TRANCOUNT AS W --返回当前连接的活动事务数。  
SELECT @@VERSION AS W --返回SQL服务器安装的日期、版本和处理器类型。 
```