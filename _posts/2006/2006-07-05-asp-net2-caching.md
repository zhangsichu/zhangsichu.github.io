---
title: Asp.net 2.0 性能 Caching 学习
date: 2006-07-05 11:39:15 + 0080
category: [Web开发]
tags: [Web, Cache, Performance]
---

1．注意使用Page.IsPostBack确定用户是否是第一次进入页面，确定是否需要载入数据。  
```c#
void Page_Load(Object sender, EventArgs e) { 
    // ...set up a connection and command here...  
    if (!Page.IsPostBack) { 
            String query = "select * from Authors where FirstName like %JUSTIN%"; 
            myCommand.Fill(ds, "Authors"); 
            myDataGrid.DataBind(); 
        }  
}  

void Button_Click(Object sender, EventArgs e) { 
    String query = "select * from Authors where FirstName like %BRAD%"; 
    myCommand.Fill(ds, "Authors"); 
    myDataGrid.DataBind(); 
}  
```

2．Asp执行的过程：`Page_Lode ->Properties Change(e.g:ListBox:Auto Postback)->Action()(ButtonClick)`

3．关闭不必要的 `Session` 状态 `<%@ Page EnableSessionState="false" %>` 这个 `Ppage` 不存取 `Session`。注意使用 `Server Control` 不必要时可以不使用 `Server Control` 不必要时可以关闭 `ViewState`  

```
<asp:datagrid EnableViewState="false“ runat="server"/>  
<%@ Page EnableViewState="false" %>  
```

`Application` 是全局的每一个用户都一样。  
`Session` 每一个用户一套。  
`ViewState` 一个用户不同的 `Control`，`ViewState` 不同。`ViewState` 针对某个用户某个页面某个 `Control` 的`State` 是 `ViewVtate`。  

4．不用 `Exception` 来控制程序流程。`Exception` 的开销很大。  

5．使用存储过程数据访问，只读数据访问不要使用 `DataSet`，使用 `SqlDataReader` 代替 `DataSet`，`SqlDataReader`是 read-only, forward-only。  

6．关闭ASP.NET的Debug模式  

7．使用ASP.NET Output Cache 缓冲数据。  

8．页面缓冲 `<%@OutputCache%>` 参数 `Duration`(过期时间) `VaryByParam()(get/post)` 片断缓冲`VaryByControl` use 控件缓冲 `VaryByParam` Cache for each combination of specified parameters. 多参数时，参数的每一个排列组合都会纪录一个缓冲。  

9．数据缓冲
```c#
Cache.Insert("MyData", Source, new CacheDependency(Server.MapPath("authors.xml")));  
//CacheDependency 是一个很有用的东西，数据依赖缓冲  
Cache.Insert("MyData", Source, null,DateTime.Now.AddHours(1), TimeSpan.Zero);  
Cache.Insert("MyData", Source, null, DateTime.MaxValue,TimeSpan.FromMinutes(20));  
```

10．IIS 自身设定缓存，让IIS自己来决定缓存多少。  

11．在Asp的控件中有一个`Substitution`控件，这个控件是一个`Html`头的容器，使用这个容器可以封装一个Html的请求。如果想在一个已经使用了output-caching的页面里显示动态的内容就需要使用这个`Substitution`控件。
```xml 
//Substitution定义  
<asp:Substitution ID="Substitution1" runat="server" MethodName="GetCurrentDate" />   
//页面中Call back 的方法 注意：这个方法必须是静态方法  
<script runat="server">  
    Shared Function GetCurrentDate(ByVal context As HttpContext) As String  
        Return Now.ToString()  
    End Function  
</script>  
```

12．`<%@ OutputCache Duration="60" VaryByParam="none" %>` 可以在一个控件里设置 `OutputCache`, 那么在那个用户控件就别自动的缓存了，当这个控件别托拽到aspxPage上时，这个控件自身就缓存了。  

13．`System.Web.Caching.Cache` 存入需要缓存的内容。  

14．`Aspnet_regsql.exe`
```
Aspnet_regsql.e –S “.\SQLExpress” –E –d”pubs” –ed
aspnet_regsql -S slhsql2005-1 -E -d pubs -ed
aspnet_regsql -S slhsql2005-1 -E -d pubs -t authors –et
```
`<%@OutputCache duration =”999999” sqlDependency=”pubs:Authors” VaryByParam=”none” %>` 在 `WebConfig` 中的定义：
```xml
<caching>
    <sqlCacheDependency enabled="true" pollTime="1000" >
        <databases>
            <add name="pubs" connectionStringName="pubsConnectionString" />
        </databases>
    </sqlCacheDependency>
</caching>
```

15．在页面里定义`<%@ OutputCache CacheProfile="CacheFor60Seconds" VaryByParam="name" %>`这里的`CacheFor60Seconds` 是一个在 `WebConfig` 中定义好一个 `outputCacheSettings/outPutCacheProfiles`。  
```xml
<caching>  
    <outputCache>  
        <diskCache enabled="true" maxSizePerApp="2" />  
    </outputCache>  
    <outputCacheSettings>  
        <outputCacheProfiles>  
            <add name="CacheFor60Seconds" duration="60" />  
        </outputCacheProfiles>  
    </outputCacheSettings>  
</caching>  
```

16．在DataSource中使用缓存
```xml
<asp:SqlDataSource   
ID="SqlDataSource1"  
EnableCaching="True"  
CacheDuration="300"  
ConnectionString="<%$ ConnectionStrings:pubsConnectionString %>"  
SelectCommand="SELECT * FROM [titles]"  
Runat="server" OnSelecting="SqlDataSource1_Selecting" /> 
```
`DataSource` 这个缓存非常有用，在 `Cache` 栏目中提供很多设置选项来控制 `DataSource` 的 `Cache`。  

