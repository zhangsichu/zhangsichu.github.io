---
title: 将拖拽进行到底 终结篇 WindowsMessage
date: 2006-04-17 13:41:08 + 0080
category: [.Net/Java]
tags: [C#, GUI, Design, Software Development]
---


在 [将拖拽进行到底](/posts/drag-to-the-end/) 这篇文中的第四种方法，发一个消息告诉系统鼠标在 `CaptionTitle`（每个窗口自己 TitleBar）上，这样窗口的拖拽就可以由系统托管了。现在实现了在窗口中任意位置单击鼠标拖拽窗体。这两天，我又发现了一个东东，几乎可以完美的实现这个思想，用 `SendMessage(WM_NCLBUTTONDOWN, HTCAPTION, MAKELPARAM( point.x, point.y))` 或者用 `UINT CMFCDragDlg::OnNcHitTest(CPoint point)` 直接返回 `HTCAPTION`。`SendMessage` 的思想是窗口拖拽就直接由系统托管，不管鼠标点击到那里，都告诉系统，鼠标在窗体的 `CaptionBar` 上―发伪装的消息。用`UINT CMFCDragDlg::OnNcHitTest(CPoint point)` 的含义是，直接处理系统的 `Message`，不让系统托管了。在MFC中这两种方法的处理和实现有很多文章在介绍了，这里就不写了。这里就在C#下用类似的方法，来实现`SendMessage(WM_NCLBUTTONDOWN, HTCAPTION, MAKELPARAM( point.x, point.y))`和 `UINT CMFCDragDlg::OnNcHitTest(CPoint point)`。
 
 方案 1. `SendMessage(WM_NCLBUTTONDOWN, HTCAPTION, MAKELPARAM( point.x, point.y))`
 `Override WndProc` 方法当有 `WM_LBUTTONDOWN` 消息时处理。
```c#
protected override void WndProc(ref Message m)  
{  
    Point screenPoint= Control.MousePosition; 
    Point clientPoint = this.PointToClient(screenPoint); 
    if (m.Msg == UnmanagedMethods.WM_LBUTTONDOWN)  
    {  

        if(rectangleMin.Contains(clientPoint))  
        {  
            this.WindowState = FormWindowState.Minimized; 
            return;  
        }  
        if(rectangleClose.Contains(clientPoint))  
        {  
            this.Close(); 
            return;  
        }
        UnmanagedMethods.SendMessage(this.Handle, UnmanagedMethods.WM_NCLBUTTONDOWN, UnmanagedMethods.HTCAPTION, 0); 
        UnmanagedMethods.MakeLParam(screenPoint.X,clientPoint.Y); 
        return;  
    }  
    base.WndProc (ref m); 
}
```

`UnmanagedMethods.SendMessage(this.Handle, UnmanagedMethods.WM_NCLBUTTONDOWN, UnmanagedMethods.HTCAPTION, 0);`
`UnmanagedMethods.MakeLParam(screenPoint.X,clientPoint.Y);`
`return;`
发消息告诉系统自己在CaptionBar上。

方案 2. `UINT CMFCDragDlg::OnNcHitTest(CPoint point)`
自己处理消息，自己修改截获的消息，然后还给系统，告诉系统自己在CaptionBar上。  
```c#
protected override void WndProc(ref Message m)  
{  
    Point screenPoint= Control.MousePosition; 
    Point clientPoint = this.PointToClient(screenPoint); 
    if (m.Msg == UnmanagedMethods.WM_LBUTTONDOWN)  
    {  

        if(rectangleMin.Contains(clientPoint))  
        {  
            this.WindowState = FormWindowState.Minimized; 
            return;  
        }  
        if(rectangleClose.Contains(clientPoint))  
        {  
            this.Close(); 
            return;  
        }  
        m.WParam = new IntPtr(UnmanagedMethods.HTCAPTION); 
        m.Msg = UnmanagedMethods.WM_NCLBUTTONDOWN; 
        m.LParam = UnmanagedMethods.MakeLParam(screenPoint.X,clientPoint.Y); 
    }  
    base.WndProc (ref m); 
}  
```
[**源代码(Windows 2003 Serve + VS 2003编译通过)**](/assets/attachments/2006/04/17_135011_roguDragNew.rar)

