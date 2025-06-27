---
title: SQL Server 存储 Asp.Net Session
date: 2006-09-01 01:01:37 + 0080
category: [Web开发]
tags: [Web, Software Development]
---

前几天需要将现有Asp.Net程序的Session存入SqlServer 同事整理了配置Sql的过程。  
注意：存入SqlServer的Session对象必须支持序列化。  

1) Run the slq script on the sql server
`%windir%\Microsoft.NET\Framework\version\InstallPersistSqlState.sql`  
It will create a database named `ASPState` We should config the permission for asp.net process in this database.  

2) Modify the web.config
```xml
<system.web>  
    <sessionState mode="SQLServer" sqlConnectionString="data source=servername;user id=uid;password=pwd" cookieless="false" timeout="30" stateNetworkTimeout="20"/>  
</system.web>  
```
 `stateNetworkTimeout` configuration setting is used to define the time, in seconds, that the ASP.NET Web application will wait for the state server to respond to network requests. By default, this time is 10 seconds. 

3) If we using two IIS server or more, we need setup the same machine key in the web.config on those IIS. Sample:
```xml
<system.web>  
    <machineKey validation="SHA1" validationKey="F3690E7A3143C185AB1089616A8B4D81FD55DD7A69EEAA3B32A6AE813ECEECD28DEA66A23BEE42193729BD48595EBAFE2C2E765BE77E006330BC3B1392D7C73F" />  
</system.web>  
```
