---
title: 将拖拽进行到底
date: 2005-08-21 23:23:11 + 0080
category: [.Net/Java]
tags: [C#, Design, Design Pattern, GUI]
---

### 问题描述
想在 .Net下实现对一些非规则窗体，没有 `Caption，FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;` 窗体的拖拽，最小化，最大化，特殊操作的实现(如图1所示)。在黄色的区域即区域1里实现对窗体的拖拽操作，在橙色区域即区域2里实现对窗体的最小化操作，在蓝色区域即区域3里实现对窗体的关闭操作，在绿色区域即区域4里实现对窗体的特殊操作(如双倍窗体)。

![窗体设计](/assets/attachments/2005/08/21_232048_zwo3Back.gif)
_(图1)_  

### 问题实现
#### 第一种方法 添加Label为Label添加Click事件
如图2所示，如果要用这种方法实现，就要为每一个颜色区域进行切图，并要保证有正确的切图长和宽，然后设置Label的背景为这个图片。

![为Label添加Click事件](/assets/attachments/2005/08/21_232252_he7kl1.gif)
_(图2)_ 

处理他们的Click事件，拖拽处理MouseDown MouseUp事件。  

#### 第二中方法 添加Label只处理鼠标事件
判断鼠标的位置然后决定执行什么操作，这种方法很耗费资源，每次鼠标点击就要判断，鼠标是否在某个区域然后决定是否要处理。不过这个处理用多态包装了。程序看起来比较整齐。  

```c#
//定义常量  
private Point point;  
private const int dragMove=172; 
private const int dragMin=72; 
private const int dragClose=72; 
private const int dragDouble=78; 
private const int dragHeight=29; 
private MouseHandleEnum dragEnum;  

//定义MouseDown事件  
private void DragMain_MouseDown(object sender, System.Windows.Forms.MouseEventArgs e)  
{  
    point.X=e.X; 
    point.Y=e.Y; 
    if(e.Y<dragHeight)  
    {  
        if(e.X<dragMove)  
        {  
            dragEnum = MouseHandleEnum.Move; 
            return;  
        }  
        if(e.X<dragMove+dragMin)  
        {  
            dragEnum = MouseHandleEnum.Min; 
            return;  
        }  
        if(e.X<dragMove+dragMin+dragClose)  
        {  
            dragEnum = MouseHandleEnum.Close; 
            return;  
        }  
        if(e.X<dragMove+dragMin+dragClose+dragDouble)  
        {  
            dragEnum = MouseHandleEnum.Double; 
            return;  
        }   
    }  
}  

//定义MouseUp事件  
private void DragMain_MouseUp(object sender, System.Windows.Forms.MouseEventArgs e)  
{  
    point.X=e.X-point.X; 
    point.Y=e.Y-point.Y; 
    IDragMouse idragMouse;  
    switch(dragEnum)  
    {  
        case MouseHandleEnum.Move :
        idragMouse = new MouseMove(point,this); 
        break;  
        case MouseHandleEnum.Min :  
        idragMouse = new MouseMin(point,this); 
        break;  
        case MouseHandleEnum.Close :  
        idragMouse = new MouseClose(point,this); 
        break;  
        case MouseHandleEnum.Double :  
        idragMouse = new MouseDouble(point,this); 
        break;  
        default:  
        idragMouse = null; 
        break;  
    }
    if(idragMouse!=null)  
        idragMouse.MouseDo(); 
}

//定义基类  
namespace DragMouse  
{  
    public enum MouseHandleEnum  
    {  
        None=0,  
        Move=1,  
        Min=2,  
        Close=3,  
        Double=4,  
    }  
    public class DragMouseBase  
    {  
        protected Point point;  
        public Form form;  
        public DragMouseBase(Point point, Form form)  
        {  
            this.point = point; 
            this.form = form; 
        }
    }
}

//定义接口  
namespace DragMouse  
{  
    /// <summary>  
    ///   
    /// </summary>  
    public interface IDragMouse  
    {  
        void MouseDo(); 
    }  
}

//拖拽操作  
namespace DragMouse  
{  
    /// <summary>  
    ///   
    /// </summary>  
    public class MouseClose : DragMouseBase,IDragMouse  
    {  
        public MouseClose(Point point,Form form):base(point,form)  
        {  
            //   
            // TODO: Add constructor logic here  
            //  
        }  

        public void MouseDo()  
        {  
            Application.Exit(); 
            // TODO: Add MouseClose.MouseDo implementation  
        }
    }  
}  
//其他操作类似。  
```

#### 第三种方 责任链设计模式
用责任链这个设计模式来包装鼠标点击操作，把操作分配到各个责任链的节点上，是程序更加面向对象，有更好的扩展性。

```c#
//两个鼠标事件  
private void DragMain_MouseDown(object sender, System.Windows.Forms.MouseEventArgs e)  
{  
    request.GetInformation(e.X,e.Y);
}  

private void DragMain_MouseUp(object sender, System.Windows.Forms.MouseEventArgs e)  
{  
    request.SetScreenPoint(e.X,e.Y);
}  

//封装的请求类  
public class Request  
{  
    public int iScreenX;  
    public int iScreenY;  

    public int eX;  
    public int eY;  

    public readonly int yHigh;  
    public readonly int dragLength;  
    public readonly int minLength;  
    public readonly int closeLength;  
    public readonly int doubleLength;  

    private DragHandler dragHandler;  
    private MinHandler minHandler;  
    private CloseHandler closeHandler;  
    private DoubleHandler doubleHandler;  

    public Form parentForm;  

    public void SetScreenPoint(int iX,int iY)  
    {  
        iScreenX = iX; 
        iScreenY = iY; 
        dragHandler.HandleRequest(this); 
    }  

    public void GetInformation(int ex,int ey)  
    {  
        eX=ex; 
        eY=ey; 
    }  

    public Request(int yhigh,int draglength,Form form)  
    {  
        yHigh = yhigh; 
        dragLength = draglength; 
        parentForm = form; 
        dragHandler = new DragHandler(); 
        minHandler =new MinHandler(); 
        closeHandler = new CloseHandler(); 
        doubleHandler = new DoubleHandler(); 

        dragHandler.SetSuccessor(minHandler); 
        minHandler.SetSuccessor(closeHandler); 
        closeHandler.SetSuccessor(doubleHandler); 
    }  

    public Request(int yhigh,int draglength,int minlength,Form form):this(yhigh,draglength,form)  
    {  
        minLength = minlength; 
    }  

    public Request(int yhigh,int draglength,int minlength,int closelength,Form form):this(yhigh,draglength,minlength,form)  
    {  
        closeLength = closelength; 
    }  

    public Request(int yhigh,int draglength,int minlength,int closelength, int doublelength , Form form):this(yhigh,draglength,minlength,closelength,form)  
    {  
        doubleLength = doublelength; 
    }  
}

//拖拽操作  
public class DragHandler : Handler  
{  
    override public void HandleRequest(Request request)  
    {  
        // determine if we can handle the request  
        if ((request.eY<request.yHigh)&&(request.eX<request.dragLength)) // some complex decision making!  
        {  
            request.parentForm.Left += request.iScreenX-request.eX;  
            request.parentForm.Top += request.iScreenY-request.eY;  
            // request handling code goes here  
        }  
        else   
        {  
            // not handled here - pass on to next in the chain  
            if (successorHandler != null)
                successorHandler.HandleRequest(request); 
        } 
    }  
}
//其他操作类似  
```

#### 第四种方法 一个构想
只是有想法还没有找到成功的实现办法，在MFC中可以用PostMessage或者SendMessag发消息，当鼠标单击，但不在窗体的CaptionTitle上时，发一个消息告诉系统鼠标在CaptionTitle（每个窗口自己TitleBar）上，这样窗口的拖拽就可以由系统托管了。现在实现了在窗口中任意位置单击鼠标拖拽窗体。但是没有实现上面要求的那些多样化操作。  

```c++
if(point.y<this->m_Height)  
{  
    //发消息给系统伪装鼠标在Caption Bar 上。  
    if(point.x<this->m_Drag)  
    {  
        PostMessage(WM_NCLBUTTONDOWN,  
        HTCAPTION,  
        MAKELPARAM(point.x,point.y));  
        return;  
    }  
    if(point.x<this->m_Drag+this->m_Min&&point.x>this->m_Drag)  
    {  
        PostMessage(WM_NCLBUTTONDOWN,  
        HTMINBUTTON,  
        MAKELPARAM(point.x,point.y));  
        return;  
    }  
    if(point.x<this->m_Drag+this->m_Min+this->m_Close&&point.x>this->m_Drag+this->m_Min)  
    {  
        PostMessage(WM_NCLBUTTONDOWN,  
        HTCLOSE,  
        MAKELPARAM(point.x,point.y));  
        return;  
    }  
    if(point.x<this->m_Drag+this->m_Min+this->m_Close+this->m_Double&&point.x>this->m_Drag+this->m_Min+this->m_Close)  
    {  
        CRgn *rgn = new CRgn(); 
        CRect *rect =new CRect(); 
        this->GetWindowRect(*rect); 
        this->SetWindowRgn(*rgn,true); 
        return;  
    }
}
```
遗憾，第四种方法是效率最高的，但是没有完全搞出来。

[**源代码(WindowsXp Sp2 + VC7 下编译通过)**](/assets/attachments/2005/08/21_232715_fc5jDrag.rar)
