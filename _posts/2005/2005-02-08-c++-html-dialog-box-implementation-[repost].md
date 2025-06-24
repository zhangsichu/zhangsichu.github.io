---
title: "C++ HTML对话框的实现[转载]"
date: 2005-02-08 12:31:56 + 0800
category: [C++/C]
tags: [C++/C, HTML, 转载]
---

###### 开发环境：VS7，Windows XP，Windows 2K
---


在VS7中添加了一种新的对话框类：CDHtmlDialog，顾名思义就是能够显示DHTML内容的对话框，但不同与以前的CHTMLView不同的是添加了对DHTML的支持，能够响应各种DHTML的事件，而且能够方便的得到网页上的各种内容和输入。在这以前要完成这些功能必须通过复杂的COM接口来完成，而现在MS MFC已经为我们做好了这一切。   

在下面我会按照下面的顺序讲解CDHtmlDialog的用法。但本文也只能对DHTML对话框的功能进行部分的讲解，更多更全的说明需要大家自己摸索和查找资料。本文的目的是在于讲解如何得到和设置网页上的各种元素的值，如何处理事件。   

此外在阅读本文前你必须对HTML和DHTML有所了解。   

`CDHtmlDialog` 类的成员函数   
`CDHtmlDialog` 事件处理映射宏   
`CDHtmlDialog` 类的各种DDX帮助宏

## 一个简单的例子   
类成员函数介绍
```cpp
//构造函数  
CDHtmlDialog();
CDHtmlDialog(  
  LPCTSTR lpszTemplateName,  
  LPCTSTR szHtmlResID,  
  CWnd *pParentWnd = NULL   
);  
CDHtmlDialog(  
  UINT nIDTemplate,  
  UINT nHtmlResID = 0,  
  CWnd *pParentWnd = NULL   
);  
```

你可以看到和CDialog不同的就在于第二个参数，表示在对话框创建时是否自动加载HTML，这里必须说明的是HTML必须以资源的形式存放，这个参数指明的是资源的ID或名称。

![VS Tool Box](/assets/attachments/2005/02/08_004134_oldrhtml_rs.gif)  

或者你可以利用

```cpp
BOOL LoadFromResource(  
  LPCTSTR lpszResource   
);  
BOOL LoadFromResource(  
  UINT nRes   
);  
```

将HTML内容在后期进行装载。   

此外一些函数如：`OnNavigateComplete，OnBeforeNavigate，Navigate` 等用于页面转换的函数，在以前的CHtmlView中就有这里就不再作讲解。  

得到当前URL：
```cpp
void GetCurrentUrl(  
  CString& szUrl   
);  
```

得到网页中的DHTML元素的指定接口：
```cpp
HRESULT GetElementInterface(  
  LPCTSTR szElementId,  
  REFIID riid,  
  void** ppvObj   
);  
```
第一个参数指定，第二个参数指定接口ID，第三个参数返回接口指针。

得到网页中的DHTML元素的IHTMLElement接口：
```cpp
HRESULT GetElement(  
  LPCTSTR szElementId,  
  IHTMLElement **pphtmlElement   
);  
```
相当于调用 `GetElementInterface(szElementId,IHTMLElement,pphtmlElement);`  

这个函数非常的重要，因为如果要得到DHTML的内容就必须通过页面上的各个元素的属性来得到，例如：对于Input type=text的属性value就是输入的值，对于p的属性innerText就是段落中的内容。   

函数的第二个参数就是元素的名称，是一个指向指针的指针，通过它得到IHTMLElement的接口。函数返回值是HRESULT其值的定义符合COM中对返回值的定义。（如果你不了解，可以简单的检测返回值是否等于S_OK）   

得到元素的innerText和innerHTML的属性：
```cpp
//innerHTML属性：  
BSTR GetElementHtml(  
  LPCTSTR szElementId   
);  
//innerText属性：  
BSTR GetElementText(  
  LPCTSTR szElementId   
);
```

相当于调用IHTMLElement接口的get_innerHTML和get_innerText方法与之对应的是设置元素的innerText和InnerHTML属性：   
```cpp
//innerHTML属性：  
void SetElementHtml(  
  LPCTSTR szElementId,  
  BSTR bstrText   
);  
//innerText属性：  
void SetElementText(  
  LPCTSTR szElementId,  
  BSTR bstrText   
);
```
相当于调用IHTMLElement接口的put_innerHTML和put_innerText方法。

假设页面上的代码为：`<p id=p2>test</p>`，执行下面代码可以显示原来的内容和将新内容设置为：abcdefg   
```cpp
CComPtr<IHTMLElement> spP1;  
HRESULT hr = S_OK;  

// Use the template overload  
hr = GetElementInterface("p2", &spP1);
// 或者 hr = GetElement("p2", &spP1);
// 或者 hr = GetElementInterface("p2", IID_IHTMLElement, reinterpret_cast<void**>(&spP1));
if(S_OK == hr)  
{  
  BSTR bStr;
  spP1->get_innerHTML(&bStr);
  CString szTemp;
  szTemp = bStr;
  AfxMessageBox(szTemp);

  CString strTable="abcdefg";
  BSTR bstrTable = strTable.AllocSysString();
  spP1->put_innerHTML(bstrTable);
}
```

或者利用SetElementHtml和SetElementText来进行设置：

```cpp 
BSTR bStr; bStr = GetElementHtml("p2"); 
CString szTemp; szTemp = bStr; AfxMessageBox(szTemp); 
CString strTable="ABCDEFG"; BSTR bstrTable = strTable.AllocSysString(); 
//spP1->put_innerHTML(bstrTable); SetElementHtml("p2",bstrTable);
```

事件处理映射宏基本格式：
```cpp
BEGIN_DHTML_EVENT_MAP(className )  
DHTML_EVENT_ONCLICK(elemName, memberFxn ) //处理onclick事件  
DHTML_EVENT_ONFOCUS(elemName, memberFxn ) //处理onfocus事件  
DHTML_EVENT_ONKEYDOWN(elemName, memberFxn ) //处理onkeydown事件  
DHTML_EVENT_ONMOUSEMOVE(elemName, memberFxn ) //处理mousemove事件  
DHTML_EVENT_ONMOUSEOUT(elemName, memberFxn ) //处理mousemoveout事件  
```

`END_DHTML_EVENT_MAP() `

更详细的说明可以查阅MSDN中DHTML Event Map Macros部分。MSDN中对可以处理的事件进行了详细的说明。DHTML中的事件与Windows中消息不是同一个概念，虽然映射宏的形式很相同。   

添加映射处理代码，我在VC7中没有发现自动添加各种事件映射的方法，只能通过手工添加代码的方式。   
定义事件处理函数，函数原型为：`HRESULT urClass::OnXXXXX(IHTMLElement* /*pElement*/)`
添加消息映射：
```cpp
BEGIN_DHTML_EVENT_MAP(urClass)  
DHTML_EVENT_ONCLICK(_T("id name"), OnXXXXX)  
END_DHTML_EVENT_MAP()  

下面是一段示范代码：  
// mydlg.h  
class CmydhtmlDlg : public CDHtmlDialog  
{  
// 构造  
public:  
  CmydhtmlDlg(CWnd* pParent = NULL); // 标准构造函数

// 对话框数据  
  enum { IDD = IDD_MYDHTML_DIALOG, IDH = IDR_HTML_MYDHTML_DIALOG };

protected:  
  virtual void DoDataExchange(CDataExchange* pDX); // DDX/DDV 支持

  HRESULT OnButtonOK(IHTMLElement *pElement);
  HRESULT OnButtonCancel(IHTMLElement *pElement);
  RESULT OnButtonTest1(IHTMLElement *pElement);
  HRESULT OnButtonTest2(IHTMLElement *pElement);
  HRESULT OnButtonTest3(IHTMLElement *pElement);
  HRESULT OnSelectTest1(IHTMLElement *pElement);
  HRESULT OnDivMouseMove1(IHTMLElement *pElement);
  HRESULT OnDivMouseOut1(IHTMLElement *pElement);

//mydlg.cpp  
  BEGIN_DHTML_EVENT_MAP(CmydhtmlDlg)  
  DHTML_EVENT_ONCLICK(_T("ButtonOK"), OnButtonOK)  
  DHTML_EVENT_ONCLICK(_T("ButtonCancel"), OnButtonCancel)  
  DHTML_EVENT_ONCLICK(_T("Test1"), OnButtonTest1)  
  DHTML_EVENT_ONCLICK(_T("Test2"), OnButtonTest2)  
  DHTML_EVENT_ONCLICK(_T("Test3"), OnButtonTest3)  
  DHTML_EVENT_ONCHANGE(_T("s1"), OnSelectTest1)  
  DHTML_EVENT_ONMOUSEMOVE(_T("d1"), OnDivMouseMove1)  
  DHTML_EVENT_ONMOUSEOUT(_T("d1"), OnDivMouseOut1)  
  END_DHTML_EVENT_MAP()  

HRESULT CmydhtmlDlg::OnButtonOK(IHTMLElement* /*pElement*/)  
{  
  OnOK();
  return S_OK;  
}  

HRESULT CmydhtmlDlg::OnButtonCancel(IHTMLElement* /*pElement*/)  
{  
  OnCancel();
  return S_OK;  
}  

HRESULT CmydhtmlDlg::OnButtonTest1(IHTMLElement* /*pElement*/)  
{  
  AfxMessageBox("test1 button clicked");
  return S_OK;  
}  

HRESULT CmydhtmlDlg::OnSelectTest1(IHTMLElement* /*pElement*/)  
{  
  RACE("select1 changed\n");
  return S_OK;  
}  

HRESULT CmydhtmlDlg::OnDivMouseMove1(IHTMLElement* /*pElement*/)  
{  
   TRACE("div1 mouse move\n");
   return S_OK;  
}  

HRESULT CmydhtmlDlg::OnDivMouseOut1(IHTMLElement* /*pElement*/)  
{  
  TRACE("div1 mouse out\n");
  return S_OK;  
}  
```

## 各种DDX帮助宏   

**DDX宏介绍**

如同CDialog类一样，CHtmlDialog也提供各种DDX帮助宏来与HTML页面上的控件交换数据。遗憾的是VS7中无法为CDHTMLDialog 的子类自动添加DDX变量，必须通过手工添加。   

设置innerText和innerHTML属性：
```cpp
DDX_DHtml_ElementInnerText(  
  CDataExchange* dx,  
  LPCTSTR name,  
  CString& var   
)  

DDX_DHtml_ElementInnerHtml(  
  CDataExchange* dx,  
  LPCTSTR name,  
  CString& var   
) 
``` 
相当与前面提到的设置和获取innerText，innerHTML属性。  

获取和设置控件中的值，在DHTML中利用“对象名程.value”可以得到控件中输入的值，利用DDX也同样可以得到：
```cpp
DDX_DHtml_ElementValue(  
  CDataExchange* dx,  
  LPCTSTR name,  
  var   
) 
``` 
用于在控件和对象之间交换数据。  

使用方法   

假设HTML文件中代码如下：
```html
<p id="p4"><b>p4 for ddx</b></p>  
<input type="text" ID="input1" size="20" value="input1 for ddx" NAME="input1" />  
<input type="text" ID="input2" size="20" value="101" NAME="input2" />  
```

在H文件中添加变量定义：  
```cpp
public: //DDX  
  CString m_szP4, m_szInput1;  
  int m_iInput2;  

//在类的构造函数中赋初值：  
CmydhtmlDlg::CmydhtmlDlg(CWnd* pParent /*=NULL*/)  
: CDHtmlDialog(CmydhtmlDlg::IDD, CmydhtmlDlg::IDH, pParent)  
{  
  m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
  m_szP4 = "test for p4";
  m_szInput1= "test for input1";
  m_iInput2 = 101;
}  

//在CPP文件中的void CmydhtmlDlg::DoDataExchange(CDataExchange* pDX)函数中添加代码：  
void CmydhtmlDlg::DoDataExchange(CDataExchange* pDX)  
{  
  CDHtmlDialog::DoDataExchange(pDX);
  //// for html ddx  
  DDX_DHtml_ElementInnerHtml(pDX,"p4",m_szP4); //对应 p4
  DDX_DHtml_ElementValue(pDX,"input1",m_szInput1); //对应 input1
  DDX_DHtml_ElementValue(pDX,"input2",m_iInput2); //对应 input2
} 

//使用是与CDialog一样利用UpdateData。  
HRESULT CmydhtmlDlg::OnButtonTest4(IHTMLElement* /*pElement*/)  
{  
  UpdateData();
  TRACE("p4=%s\n",m_szP4);
  CString szTemp=m_szP4;
  m_szP4 =m_szInput1;
  m_szInput1=szTemp; //对换p4和input1中内容
  m_iInput2 ++; //将input2中数字加一
  UpdateData(FALSE);
  return S_OK;  
}  
```

## 最后介绍一下如何利用VC7创建一个利用CDHtmlDialog的工程

首先创建工程，进行如下设置：  
![Create Project](/assets/attachments/2005/02/08_004246_he7kcreate_prj.gif)

在资源管理中修改HTML文件：  
![Add Code](/assets/attachments/2005/02/08_004322_kh0oedit_html.gif)

最后添加自己的代码。我提供的例子中所使用的函数在上面都已经提到。大家可以用这个例子来进行进一步的尝试。
