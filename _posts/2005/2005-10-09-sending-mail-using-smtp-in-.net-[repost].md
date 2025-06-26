---
title: 在.NET中使用SMTP发送邮件[转载]
date: 2005-10-26 20:03:22 + 0080
category: [.Net/Java]
tags: [C#, Software Development, 转载]
---

这是一篇转载，可能对大家很有用，本文提到的方案仍然不能算是完全解决所有问题，最佳的.NET下通过SMTP（带验证）发送邮件的机制是什么，不知道大家有什么好的看法！   

### 摘要   

本文简单介绍了SMTP协议(RFC2554)发送邮件的过程，并讨论了在 .NET 中使用SMTP发送邮件由简到繁的三种不同方案、各自可能遇到的问题及其解决办法。  

### 目录  

1. 简介   
1. .NET的SMTP类   
1. 使用CDO组件发送邮件   
1. 使用Socket撰写邮件发送程序   
1. 总结   
1. 更多的信息   


### 简介
邮件发送功能常常是许多.NET应用，尤其是带网络功能的应用中不可缺少的模块之一，本文就此介绍了使用.NET的SMTP类库和另两种分别通过CDO(Collaboration Data Objects)及Socket来实现发送邮件功能的方法。  

### .NET的SMTP类  

首先，我们来介绍一下.NET类库种自带的SMTP类。在.NET中的System.Web.Mail名字空间下，有一个专门使用SMTP协议来发送邮件的类：SmtpMail,它已能满足最普通的发送邮件的需求。这个类只有一个自己的公共函数--Send()和一个公共属性―SmtpServer，如下图：  

![.NET的SMTP类](/assets/attachments/2005/10/26_200517_2yq5sendmail.gif)  

您必须通过SmtpServer属性来指定发送邮件的服务器的名称（或IP地址）,然后再调用 `Send()` 函数来发送邮件。  

代码示例如下：  
```c#
using System.Web.Mail;
public void sendMail()
{                  
      try
      {
            System.Web.Mail.MailMessage myMail=new MailMessage();
            myMail.From = "myaccount@test.com";
            myMail.To = "myaccount@test.com";
            myMail.Subject = "MailTest";
            myMail.Priority = MailPriority.Low;
            myMail.BodyFormat = MailFormat.Text;
            myMail.Body = "Test";
            SmtpMail.SmtpServer="smarthost"; //your smtp server here

            SmtpMail.Send(myMail);                        
      }                  
      catch(Exception e)
      {
            throw e;                              
      }
}
```

您可以在Send函数的参数MailMessage对象中设置邮件的相关属性，如优先级、附件等等。除了以 MailMessage 对象为参数（如上述代码），Send函数还可以简单的直接以邮件的4个主要信息（from，to，subject， messageText）作为字符串参数来调用。  

### 使用CDO组件发送邮件  

CDO 是 Collaboration Data Objects的简称，它是一组高层的COM对象集合，并经历了好几个版本的演化，现在在Windows2000和Exchange2000中使用的都是 CDO2.0的版本（分别为cdosys.dll和cdoex.dll）。CDOSYS构建在SMTP协议和NNTP协议之上，并且作为 Windows2000 Server的组件被安装，您可以在系统目录（如c:\winnt或c:\windows）的system32子目录中找到它 (cdosys.dll)。  

CDO组件相对于先前介绍的SmtpMail对象功能更为丰富，并提供了一些SmtpMail类所没有提供的功能，如通过需要认证的SMTP服务器发送邮件等。  

下面一段代码就展示了如何使用CDO组件通过需要认证的SMTP服务器发送邮件的过程：  

```c#
public void CDOsendMail()
{
      try
      {                        
            CDO.Message oMsg = new CDO.Message();
                   
            oMsg.From = "myaccount@test.com";
            oMsg.To = "myaccount@test.com";
            oMsg.Subject = "MailTest";
            oMsg.HTMLBody = "<html><body>Test</body></html>";
            CDO.IConfiguration iConfg = oMsg.Configuration;
            ADODB.Fields oFields = iConfg.Fields;
                                                            
            oFields["http://schemas.microsoft.com/cdo/configuration/sendusing"].Value=2;
            oFields["http://schemas.microsoft.com/cdo/configuration/sendemailaddress"].Value="myaccount@test.com"; //sender mail
            oFields["http://schemas.microsoft.com/cdo/configuration/smtpaccountname"].Value="myaccount@test.com"; //email account
            oFields["http://schemas.microsoft.com/cdo/configuration/sendusername"].Value="username";
            oFields["http://schemas.microsoft.com/cdo/configuration/sendpassword"].Value="password";      
            oFields["http://schemas.microsoft.com/cdo/configuration/smtpauthenticate"].Value=1;

            //value=0 代表Anonymous验证方式（不需要验证）
            //value=1 代表Basic验证方式（使用basic (clear-text) authentication. 
            //The configuration sendusername/sendpassword or postusername/postpassword fields are used to specify credentials.）
            //Value=2 代表NTLM验证方式（Secure Password Authentication in Microsoft Outlook Express）
            oFields["http://schemas.microsoft.com/cdo/configuration/languagecode"].Value=0x0804;
            oFields["http://schemas.microsoft.com/cdo/configuration/smtpserver"].Value="smtp.21cn.com";

            oFields.Update();
            oMsg.BodyPart.Charset="gb2312";
            oMsg.HTMLBodyPart.Charset="gb2312"; 

            oMsg.Send();
            oMsg = null;
      }                  
      catch (Exception e)
      {
            throw e;
      }
}
```

注意：由于Exchange2000的CDO组件cdoex.dll会更新原有的Windows2000的CDO组件cdosys.dll,所以如果您希望继续使用cdosys.dll，您必须先通过regsrv32.exe卸载掉cdoex.dll。  

### 使用Socket撰写邮件发送程序  

当然，如果您觉得SmtpMail不能满足您的需求，CDO又不够直截了当，那就只能自己动手了；其实如果您很熟悉Socket编程，自己写一个发送邮件的程序并不很难，以下就是一个例子。  
首先，我们简单介绍一下带验证的SMTP服务器如何使用AUTH原语进行身份验证，其详细的定义可以参考RFC2554。

**具体如下：**  
1. 首先，需要使用EHLO而不是原先的HELO。  
2. EHLO成功以后，客户端需要发送AUTH原语，与服务器就认证时用户名和密码的传递方式进行协商。  
3. 如果协商成功，服务器会返回以3开头的结果码，这是就可以把用户名和密码传给服务器。  
4. 最后，如果验证成功，就可以开始发信了。  

下面是一个实际的例子，客户端在WinXP的Command窗口中通过"telnet smtp.263.NET 25"命令连接到263的smtp服务器发信：  

```
220 Welcome to coremail System(With Anti-Spam) 2.1
EHLO 263.NET
250-192.168.30.29
250-PIPELINING
250-SIZE 10240000
250-ETRN
250-AUTH LOGIN
250 8BITMIME
AUTH LOGIN
334 VXNlcm5hbWU6
bXlhY2NvdW50
334 UGFzc3dvcmQ6
bXlwYXNzd29yZA==
235 Authentication successful
MAIL FROM:myaccount@263.NET
250 Ok
RCPT TO:myaccount@263.NET
250 Ok
Data
354 End data with <CR><LF>.<CR><LF>
This is a testing email.
haha.
.
250 Ok: queued as AC5291D6406C4
QUIT
221 Bye
```

上面的内容就是发信的全过程。其中与身份验证有关的主要是第九到第14行：

`AUTH LOGIN` 客户端输入
`334 VXNlcm5hbWU6` 服务器提示 `“Username:="`
`bXlhY2NvdW50` 客户端输入 `“myaccount="` 的 `Base64` 编码
`334 UGFzc3dvcmQ6` 服务器提示 `“Password:="`  
`bXlwYXNzd29yZA==` 客户端输入 `“mypassword="` 的 `Base64` 编码  
`235 Authentication successful` 服务器端通过验证  

从上面的分析可以看出，在这个身份验证过程中，服务器和客户端都直接通过`Socket`传递经过标准`Base64`编码的纯文本。这个过程可以非常方便的用C#实现，或者直接添加到原有的源代码中。  

另外，有些ESMTP服务器不支持AUTH LOGIN方式的认证，只支持AUTH CRAM-MD5方式验证。但是这两者之间的区别只是文本的编码方式不同。  

实现此功能的源代码可以在SourceForge.NET http://sourceforge.NET/projects/opensmtp-net/ 上找到下载。下面给出了一个简单的伪码：  

```c#
public void SendMail(MailMessage msg)                  
{            
      NetworkStream nwstream = GetConnection();

      WriteToStream(ref nwstream, "EHLO " + smtpHost + "\r\n");
      string welcomeMsg = ReadFromStream(ref nwstream);

      // implement HELO command if EHLO is unrecognized.
      if (IsUnknownCommand(welcomeMsg))
      {
         WriteToStream(ref nwstream, "HELO " + smtpHost + "\r\n");
      }
      CheckForError(welcomeMsg, ReplyConstants.OK);                        

      // Authentication is used if the u/p are supplied
      AuthLogin(ref nwstream);

      WriteToStream(ref nwstream, "MAIL FROM: <" + msg.From.Address + ">\r\n");
      CheckForError(ReadFromStream(ref nwstream), ReplyConstants.OK);

      SendRecipientList(ref nwstream, msg.To);
      SendRecipientList(ref nwstream, msg.CC);
      SendRecipientList(ref nwstream, msg.BCC);

      WriteToStream(ref nwstream, "DATA\r\n");
      CheckForError(ReadFromStream(ref nwstream), ReplyConstants.START_INPUT);

      if (msg.ReplyTo.Name != null && msg.ReplyTo.Name.Length != 0)
        WriteToStream(ref nwstream, "Reply-To: \"" + msg.ReplyTo.Name + "\" <" + msg.ReplyTo.Address + ">\r\n"); 
      else
        WriteToStream(ref nwstream, "Reply-To: <" + msg.ReplyTo.Address + ">\r\n");
            
      if (msg.From.Name != null && msg.From.Name.Length != 0)
        WriteToStream(ref nwstream, "From: \"" + msg.From.Name + "\" <" + msg.From.Address + ">\r\n");
      else
        WriteToStream(ref nwstream, "From: <" + msg.From.Address + ">\r\n");
      
      WriteToStream(ref nwstream, "To: " + CreateAddressList(msg.To) + "\r\n");
      
      if (msg.CC.Count != 0)
        WriteToStream(ref nwstream, "CC: " + CreateAddressList(msg.CC) + "\r\n");

      WriteToStream(ref nwstream, "Subject: " + msg.Subject + "\r\n");

      if (msg.Priority != null)
        WriteToStream(ref nwstream, "X-Priority: " + msg.Priority + "\r\n");

      if (msg.Headers.Count > 0)
      {
         SendHeaders(ref nwstream, msg);
      }
      
      if (msg.Attachments.Count > 0 || msg.HtmlBody != null)
      {
         SendMessageBody(ref nwstream, msg);
      }
      else
      {
         WriteToStream(ref nwstream, msg.Body + "\r\n"); 
      }
      
      WriteToStream(ref nwstream, "\r\n.\r\n");
      CheckForError(ReadFromStream(ref nwstream), ReplyConstants.OK);


      WriteToStream(ref nwstream, "QUIT\r\n");
      CheckForError(ReadFromStream(ref nwstream), ReplyConstants.QUIT);

      CloseConnection();
}

private bool AuthLogin(ref NetworkStream nwstream)
{
    if (username != null && username.Length > 0 && password != null && password.Length > 0)
    {
        WriteToStream(ref nwstream, "AUTH LOGIN\r\n");
        if (AuthImplemented(ReadFromStream(ref nwstream)))
        {
                WriteToStream(ref nwstream, Convert.ToBase64String(Encoding.ASCII.GetBytes(this.username.ToCharArray())) + "\r\n");
                CheckForError(ReadFromStream(ref nwstream), ReplyConstants.SERVER_CHALLENGE);
                WriteToStream(ref nwstream, Convert.ToBase64String(Encoding.ASCII.GetBytes(this.password.ToCharArray())) + "\r\n");
                CheckForError(ReadFromStream(ref nwstream), ReplyConstants.AUTH_SUCCESSFUL);
                return true;
        }
    }
    return false;
}
```

### 总结  

本文介绍了.NET中三种不同的使用SMTP协议发送邮件的方法，其中第一种（使用SmtpMail类）方案能满足大部分基本的发送邮件的功能需求，而第二种（使用CDO组件）和第三种（使用Socket自己撰写SMTP类）方案提供更自由和完整的定制方法，比如他们都能实现第一种方案不能做到的通过带认证的SMTP服务器发送邮件的功能。  

原文地址 https://www.cnblogs.com/sgsoft/archive/2005/03/21/123030.html
