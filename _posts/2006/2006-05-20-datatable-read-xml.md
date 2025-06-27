---
title: 让DataTable也ReadXml
date: 2006-05-20 12:49:31 + 0080
category: [.Net/Java]
tags: [C#, Database, Software Development]
---

在.Net `DataSet` 这个类中，提供了 `DataSet.ReadXml` 和 `DataSet.ReadXmlSchema` 这两个强大的方法。可以非常灵活的用 Xml 信息来填充一个 `DataSet`。.Net 支持用 Xml 文件，XmlRead, TextRead,Stream 来填充 DataSet。在填充的时候，可以用 `XmlReadMode` 来指定读取 Xml 信息的方式，从而确定填充的方式。其中的 `XmlReadMode.ReadSchema` 方式，可以确保读入数据的Schema正确。`DiffGram `指定用 `DiffGram` 方式读取 `DiffGram` 格式的Xml来填充数据，`Fragment` 可以用 Sql for xml auto 的查询结果来填充 Xml。  
上面这些强大的功能都是在 `DataSet` 上提供的。可能一般的应用程序，只需要和一个 `DataTable` 时时交互就可以了。应用程序运行时，`DataTable` 在内存中，让一个 `DataTable` 和一个Xml时时交互。就是本文实例代码实现的功能。就是好像让`DataTable` 也`ReadXml WriteXml` 了。  

 **下面是.Net提供的DataSet.ReadXml**  

```c#
DataSet dataSet = new DataSet();  
dataSet.ReadXmlSchema("Data.xsd");  
dataSet.ReadXml("Data.xml",XmlReadMode.ReadSchema);  
this.gridMain.DataSource = dataSet;  
dataSet.WriteXml("Out.xml", XmlWriteMode.WriteSchema);  
```

 **下面是DataTable ReadXml**  

```c#
XmlHelper helper = new XmlHelper("Data.xml", "/DailyReportApplication/FieldItem", "/DailyReportApplication/FieldInfo", 0);  
this.gridMain.DataSource = helper.GetFieldTable();  
```
`XmlHelper中有一个GetFieldTable()` 这个方法返回 Read出来的DataTable。Xml的构造方法中传入了4个参数：
1.Xml文件 
2.Xml 中的Schema定义区 
3.Xml中的的数据定义区 
4.DataTable中的PrimaryKey列
PrimaryKey列用来定位一个指定的`DataRow`。`XmlHelper`中的`WriteFieldTable()` `WriteSingleField()` 把`DataTable` 写到 Xml中。其中也可以用XPath来唯一定位一个元素。  

`XmlHelper中InitializeFieldTable()` 方法 填充`DataTable Schema`  
```c#
private void InitializeFieldTable()  
{  
    this._fieldTable = new DataTable();  
    XmlNodeList nodes = this._document.SelectNodes(this._fieldItem);  
    foreach(XmlNode node in nodes)  
    {  
        this._fieldTable.Columns.Add(node.ChildNodes.Item(0).InnerText, System.Type.GetType(node.ChildNodes.Item(1).InnerText));  
    }  
}  
```

`XmlHelper` 中 `FillFieldTable()` 方法 填充 `DataTable()`  

```c#    
private void FillFieldTable()  
{  
    XmlNodeList nodes = this._document.SelectNodes(this._fieldInfo);  
    foreach(XmlNode node in nodes)  
    {  
        DataRow row = this._fieldTable.NewRow();  
        for(int i=0;i<node.ChildNodes.Count;i++)  
        {  
            row[i] = node.ChildNodes.Item(i).InnerText;  
        }  
        this._fieldTable.Rows.Add(row);  
    }  
}  
```

**最后写入数据**
```c#  
internal void WriteSingleField(int index)  
{  
    if(this._fieldTable == null)  
    return;  
    if(this._fieldTable.Rows.Count <= index)  
    return;  
    
    XmlNodeList nodes = this._document.SelectNodes(this._fieldInfo + / + this._fieldTable.Columns[this._uniqueColumnIndex].ColumnName);  
    for(int i = 0;i<this._fieldTable.Rows.Count;i++)  
    {  
        if(nodes[i].InnerText.ToString() == this._fieldTable.Rows[i][this._uniqueColumnIndex].ToString())  
        {  
            foreach(XmlNode node in nodes[i].ParentNode.ChildNodes)  
            {  
                node.InnerText = this._fieldTable.Rows[i][node.Name].ToString();  
            }  
        }  
    }  
}  
```

[**源程序**](/assets/attachments/2006/05/21_100044_41s7DataSetDataTable.rar)
