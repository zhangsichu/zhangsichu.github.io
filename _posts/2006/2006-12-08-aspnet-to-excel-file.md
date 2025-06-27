---
title: Asp.Net 直接写一个Excel文件流
date: 2006-12-08 11:39:16 + 0080
category: [Web开发]
tags: [C#, Web, Software Development]
---

```c#
this.Page.Response.Clear(); 
this.Page.Response.BufferOutput = true; 
//Define Chareset  
this.Page.Response.Charset = "GB2312"; 
//For download.  
//Define type.  
this.Page.Response.AppendHeader("Content-Disposition", "attachment;filename = ExcelFile.xls"); 
//Define encoding.  
this.Page.Response.ContentEncoding = System.Text.Encoding.GetEncoding("GB2312"); 
//Define Application type.  
this.Page.Response.ContentType = "application/ms-Excel"; 

string strExcelHeader = string.Empty; 
string strExcelItems = string.Empty; 

//Write header;  
//Please pay a ation to the character "\t"  
strExcelHeader = "Column1\tColumn2\tColumn3\tColumn4\tColumn5\tColumn6\tColumn7\tColumn8\ttColumn9\t\n"; 

strExcelItems = "1 \t2 \t3 \t4 \t5 \t6 \t7 \t8 \t9 \t\n"; 
//Write Excel header.  
this.Page.Response.Write(strExcelHeader); 

//Write a Excel item.  
this.Page.Response.Write(strExcelItems); 

this.Page.Response.End();
```

