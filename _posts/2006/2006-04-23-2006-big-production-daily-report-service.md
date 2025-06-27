---
title: 2006 大制作之 DailyReportService
date: 2006-04-23 18:20:25 + 0080
category: [.Net/Java]
tags: [C#, GUI, Design, Software Development]
image:
  path: /assets/attachments/2006/04/23_184616_pmesapplication1.jpg
  show_top: false
---

什么叫做DailyReportService呢？DailyReportService是一个Windows Service加一个DailyReportApplication Windows应用程序。完成每日的工作情况的记录和描述。如下图当程序成功安装后会在Windows Service中多一个`Windows Service DailyReportService`:  

![Window Service](/assets/attachments/2006/04/23_184622_gd6jservice1.jpg)  

需要设置一下这个 Service，在Log On中选中 Allow service to interact with desktop(允许windows service 同桌面程序交互)  

![Window Service](/assets/attachments/2006/04/23_184626_pmesservice2.jpg)  

点击 Ctrl+Alt+Q 显示程序界面 Ctrl+Alt+W 隐藏程序界面。  

![GUI](/assets/attachments/2006/04/23_184616_pmesapplication1.jpg)  

程序如图所示。这个程序留出了许多地方让用户来控制。 
**1．界面XML描述 界面随意改**
上面的Monday Tuesday …等等这些Button的定义，可以在安装目录下的DailyReportApplication.xml文件中找到，您可以找到类似如下的描述：  
```xml
<FieldInfo>  
    <ID>5</ID>   
    <Name>Friday</Name>   
    <Order>6</Order>   
    <Visible>True</Visible>   
    <Data></Data>   
</FieldInfo>
```
它描述了界面中的Button按照怎样的顺序排序，Button是否显示，显示什么文字。点击Button后，在当日记录怎样的信息。您可以打开这个文件自己修改自己编辑。 

**2．导出(Export)模板自定制**
界面上有个Export功能，点击后会根据当前记录的每日工作情况，生成一个周报（WeeklyReport）记录这一周工作情况的报告。  
![Report](/assets/attachments/2006/04/23_181853_63u9exprot.gif)  
这个报告模板在安装目录下的 `DailyReportApplicationFormater.xml` 中，打开文件后您会看到如下的定义。`Formater/Content`下定义了报告模板的正文，`Formater/ReplaceInfo` 中定义了那些内容需要被替换，替换用到的数据内容是什么。
```xml
<Formater>  
    <Name>DefaultFormater</Name>   
    <Content>
    = Work Accomplished Last Week ====================== %WorkCompletedLastWeek/Data% 
    = Working Status=================================== 
    = Work Accomplished Last Week ====================== [Monday] %Monday/Data% [Tuesday] %Tuesday/Data% [Wednesday] %Wednesday/Data% [Thursday] %Thursday/Data% [Friday] %Friday/Data% 
    = Work Plan for This Week =========================== %WorkPlanNextWeek/Data% 
    = My Thoughts ====================================== %MyThoughts/Data%  
    </Content>  
</Formater>  
<ReplaceInfo>  
    <PlaceHolder>%WorkCompletedLastWeek/Data%</PlaceHolder>   
    <ReplaceContent>WorkCompletedLastWeek/Data</ReplaceContent>   
</ReplaceInfo>
```

**3．程序配置化**
在安装目录下的DailyReportApplication.exe.config中有如下的定义：
```xml 
<configuration>  
    <appSettings>  
        <add key="FieldInfo" value="/DailyReportApplication/FieldInfo" />   
        <add key="FieldItem" value="/DailyReportApplication/FieldItem" />   
        <add key="uniqueColumnIndex" value="0" />   
        <add key="FileName" value="DailyReportApplication.xml" />   
        <add key="FormaterFileName" value="DailyReportApplicationFormater.xml" />   
        <add key="ReplaceInfo" value="/DailyReportApplicationFormater/ReplaceInfo" />   
        <add key="ReplaceItem" value="/DailyReportApplicationFormater/ReplaceItem" />   
        <add key="FormaterName" value="/DailyReportApplicationFormater/Formater/Name" />   
        <add key="FormaterContent" value="/DailyReportApplicationFormater/Formater/Content" />   
        <add key="ExportFileName" value="ThisWeekReport.txt" />   
        <add key="UserTrayBar" value="False" />   
        <add key="ShowHotKey" value="81+3" />   
        <add key="HideHotKey" value="87+3" />   
    </appSettings>  
</configuration>
```
分别定义了用什么文件记录数据，记录数据的位置在什么地方。模版文件在什么地方，模版的正文在那里。是否在托盘里显示程序图标，显示/隐藏程序的HotKey。  
在安装目录下`的DailyReportService.exe.config` 中有如下的定义：  
```xml
<configuration>  
    <appSettings>  
        <add key="CheckPeriod" value="50000" />  
        <add key="AcceptAttach" value="True" />  
    </appSettings>  
</configuration>
```

定义了间隔多少秒后，监视一下 DailyReportApplication.exe 这个应用程序，当程序Carsh的时候，自动启动程序。  
当设定`AcceptAttach`为 `True`的时候，Service 进行检测时，不会直接启动一个新的 DailyReportApplication，会检测是否已经有一个DailyReportApplication 已经启动了，如果启动将不启动新的 DailyReportApplication，而是加载现在已经启动的 DailyReportApplication进行监视。如果现在没有 DailyReportApplication已经启动，将启动一个新的 DailyReportApplication。如果 AcceptAttach为False，当发现监视的DailyReportApplication Crash了，不检查是否DailyReportApplication已经启动，已经有了一个运行实例，直接启动一个新的DailyReportApplication。  
本程序通过 Windows Service （DailyReportService）启动 Periodic Checker , Periodic Checker 定时检查 DailyReportApplication。实现了DailyReportApplication这个应用程序在系统启动后，自动运行，被关闭后自己重新启动。 

```c#
//Set the service option by WMI:  
//at service installer committed. means the series has been installed.  
private void serviceProcessInstaller_Committed(object sender, InstallEventArgs e)  

ConnectionOptions options = new ConnectionOptions(); 
options.Impersonation = ImpersonationLevel.Impersonate; 
ManagementScope scope = new System.Management.ManagementScope(@"root\CIMV2", options); 
scope.Connect(); 

//from service name get WMI object.  
ManagementObject wmiService = new ManagementObject("Win32_Service.Name=" + serviceInstaller.ServiceName + ""); 
ManagementBaseObject inParam = wmiService.GetMethodParameters("Change"); 
inParam["DesktopInteract"] = true;  
ManagementBaseObject outParam = wmiService.InvokeMethod("Change", inParam, null); 
```

[**安装程序**](/assets/attachments/2006/04/23_182003_63u9DailyReportSetup.rar)  
[**源程序**](/assets/attachments/2006/04/27_115024_sphwDailyReportService.rar)

