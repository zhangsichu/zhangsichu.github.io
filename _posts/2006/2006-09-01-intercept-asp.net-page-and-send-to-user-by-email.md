---
title: 截取一个Asp.Net页面中的部分内容作为邮件的一部分发送给用户
date: 2006-09-01 00:03:57 + 0080
category: [Web开发]
tags: [Web, C#, Software Development, Web]
---

### 问题描述  
下面是一个Asp.Net的 Page  

```
******************************************************  
*Header   
******************************************************  
*Body   
*   
*   
*   
*   
*   
******************************************************  
*Footer   
* Send[Button]  
******************************************************
```
当用户点击Send后 抽取body 部分的html内容当作邮件正文的一部分发给用户。  

### 解法一 前端截取
在`Send Button Click` 后,先执行页面中`JavaScript` 把 `Body` 中的内容存到一个 `hidden filed` 中,然后`PostBack`。
```js
function ClientGet()  
{   
    //result is a div.  
    var result = document.getElementById("result"); 
    var hiddenInfo = document.getElementById("hiddenInfo");

    //alert(result.innerText); 
    hiddenInfo.value = result.innerHTML; 
}
```

```c#
<asp:Button ID="btnSendMail" runat="server" Text="Send" OnClientClick="ClientGet();" OnClick="btnSendMail_Click"/> 
private void SendMail( string body)  
{  
    SmtpClient smtpClient = new SmtpClient(); 
    MailMessage message = new MailMessage(); 
    MailAddress fromAddress = new MailAddress("zhangsichu@gmail.com", "HtmlPartMail"); 
    smtpClient.Host = "MailEXG";

    //smtpClient.Port = 25; 
    message.From = fromAddress; 
    message.To.Add("zhangsichu@gmail.com"); 
    message.Subject = "HtmlPartMail"; 
    message.IsBodyHtml = true; 
    message.Body = body; 
    smtpClient.Send(message);  
}  
protected void btnSendMail_Click(object sender, EventArgs e)  
{  
    if (string.IsNullOrEmpty(this.hiddenInfo.Value))  
    this.SendMail(this.hiddenInfo.Value); 
}   
<pages enableEventValidation="false" validateRequest="false"/>  
```

### 解法二 后端截取
override page 的 `Render` 方法。当页面 Render 前用一个 `static` 的 `StringBuider` 记住全部 `html`  
```c#
protected override void Render(HtmlTextWriter writer)  
{  
    HtmlForMailPart = new StringBuilder(); 
    StringWriter stringWriter = new StringWriter(HtmlForMailPart); 
    HtmlTextWriter innerWriter = new HtmlTextWriter(stringWriter);  
    base.Render(innerWriter); 
    innerWriter.Close(); 
    writer.Write(HtmlForMailPart.ToString());  
    //base.Render(writer); 
}  

//取得Body部分
public const string HtmlForMailPartBeginKey = "<!-- mial html part begin -->"; 
public const string HtmlForMailPartEndKey = "<!-- mial html part end -->"; 

public string GetMailHtmlPart()  
{  
    if (HtmlForMailPart == null)  
    {  
        return string.Empty;  
    }  

    string htmlContent = HtmlForMailPart.ToString(); 
    int startIndex = htmlContent.IndexOf(HtmlForMailPartBeginKey); 
    int endIndex = htmlContent.IndexOf(HtmlForMailPartEndKey); 

    if (endIndex < startIndex)  
    {  
        return string.Empty;  
    }

    htmlContent = "<html><head><style>td { font-size: 12px } body { font-size: 12px }</style></head><body>" + htmlContent.Substring(startIndex, endIndex - startIndex) + "</body></html>";

    return htmlContent;  
}
```

`HtmlForMailPartBeginKey`  `HtmlForMailPartEndKey`  这两个tag放在要取得内容的头和尾。 
